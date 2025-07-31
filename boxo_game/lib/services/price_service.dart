import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:http/http.dart' as http;

class PriceService {
  static final PriceService _instance = PriceService._internal();
  factory PriceService() => _instance;
  PriceService._internal();

  WebSocketChannel? _channel;
  final _priceController = StreamController<double>.broadcast();
  Stream<double> get priceStream => _priceController.stream;
  
  String _currentSymbol = 'BTC-USD';
  double _lastPrice = 100000.0;
  double _targetPrice = 100000.0;
  bool _isRealTimeData = false;
  Timer? _smoothUpdateTimer;
  Timer? _httpPollingTimer;
  
  bool get isRealTimeData => _isRealTimeData;
  
  // Multiple WebSocket URLs for real-time price data
  String get _binanceUrl => 'wss://stream.binance.com:9443/ws/${_currentSymbol.toLowerCase().replaceAll('-', '')}@aggTrade';
  String get _coinbaseUrl => 'wss://ws-feed.exchange.coinbase.com';
  String get _finnhubUrl => 'wss://ws.finnhub.io?token=YOUR_API_KEY'; // Free real-time data
  String get _cryptocompareUrl => 'wss://streamer.cryptocompare.com/v2?api_key=YOUR_API_KEY';
  String get _twelveDataUrl => 'wss://ws.twelvedata.com/v1/quotes/price?apikey=YOUR_API_KEY'; // 800 requests/day free
  
  void connect({String symbol = 'BTC-USD'}) {
    _currentSymbol = symbol;
    _disconnect();
    
    // Start smooth price updates (60 FPS)
    _startSmoothPriceUpdates();
    
    // Try Finnhub first if API key is set
    final finnhubApiKey = 'd25ifvhr01qns40f4d70'; // Your Finnhub API key
    if (finnhubApiKey != 'YOUR_FINNHUB_API_KEY') {
      _connectToFinnhub(symbol, finnhubApiKey);
    } else {
      // Try HTTP polling as immediate solution
      print('\n📊 Using HTTP polling for real-time prices...');
      print('ℹ️ To get WebSocket data, register at https://finnhub.io');
      _startHttpPolling(symbol);
    }
  }
  
  void _startHttpPolling(String symbol) {
    print('\n🌐 Starting HTTP price polling (1 update/second)...');
    
    _httpPollingTimer?.cancel();
    _httpPollingTimer = Timer.periodic(Duration(seconds: 1), (timer) async {
      try {
        // Map symbols to CoinGecko IDs
        final symbolMap = {
          'BTC-USD': 'bitcoin',
          'ETH-USD': 'ethereum',
          'SOL-USD': 'solana',
          'ADA-USD': 'cardano',
          'XRP-USD': 'ripple',
          'DOGE-USD': 'dogecoin',
          'MATIC-USD': 'matic-network'
        };
        
        final coinId = symbolMap[symbol] ?? 'bitcoin';
        print('📊 Fetching price for $coinId ($symbol)');
        
        final response = await http.get(
          Uri.parse('https://api.coingecko.com/api/v3/simple/price?ids=$coinId&vs_currencies=usd'),
        ).timeout(Duration(seconds: 2));
        
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          final price = data[coinId]['usd'].toDouble();
          
          _targetPrice = price;
          _isRealTimeData = true;
          
          final now = DateTime.now();
          if (now.second % 2 == 0) { // Log every 2 seconds
            print('🌐 $symbol: \$${price.toStringAsFixed(2)} @ ${now.hour}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')} (HTTP)');
          }
        }
      } catch (e) {
        // Fallback to simulated on error
        if (_httpPollingTimer != null && _httpPollingTimer!.isActive) {
          _httpPollingTimer!.cancel();
          print('\n❌ HTTP polling failed: $e');
          print('🔄 Using simulated prices...');
          _startAggressiveSimulatedPrices();
        }
      }
    });
  }
  
  void _startSmoothPriceUpdates() {
    _smoothUpdateTimer?.cancel();
    
    // Update exactly when we get new price data (1 second intervals)
    // No artificial interpolation - chart moves only with real data
    _smoothUpdateTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      // Emit the exact target price when it changes
      if (_targetPrice != _lastPrice) {
        _lastPrice = _targetPrice;
        _priceController.add(_lastPrice);
      }
    });
  }
  
  void _connectToFinnhub(String symbol, String apiKey) {
    final wsUrl = 'wss://ws.finnhub.io?token=$apiKey';
    
    print('\n🌟 Connecting to Finnhub WebSocket (Premium Real-time Data)...');
    print('📍 Using API key: ${apiKey.substring(0, 10)}...');
    print('🪙 Symbol: $symbol');
    
    try {
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
      
      // Subscribe to crypto symbol - Finnhub uses different format
      final finnhubSymbol = 'BINANCE:${symbol.replaceAll('-USD', 'USDT')}'; // Format: BINANCE:BTCUSDT
      final subscribeMessage = {
        'type': 'subscribe',
        'symbol': finnhubSymbol
      };
      print('📡 Subscribing to: $finnhubSymbol');
      
      _channel!.sink.add(json.encode(subscribeMessage));
      print('📤 Subscribed to Finnhub real-time feed');
      
      bool isConnected = false;
      int messageCount = 0;
      
      _channel!.stream.listen(
        (data) {
          try {
            final Map<String, dynamic> message = json.decode(data);
            
            // Finnhub trade format
            if (message['type'] == 'trade') {
              isConnected = true;
              _isRealTimeData = true;
              
              final trades = message['data'] as List?;
              if (trades != null && trades.isNotEmpty) {
                for (var trade in trades) {
                  final double price = trade['p'].toDouble();
                  _targetPrice = price;
                  
                  messageCount++;
                  // Log periodically
                  if (messageCount % 5 == 0) {
                    final now = DateTime.now();
                    print('🌟 $symbol: \$${price.toStringAsFixed(2)} @ ${now.second}.${now.millisecond}ms (Finnhub)');
                  }
                }
              }
            } else if (message['type'] == 'ping') {
              // Keep connection alive
            }
          } catch (e) {
            print('Error parsing Finnhub data: $e');
          }
        },
        onError: (error) {
          print('\n❌ Finnhub error: $error');
          print('🔄 Trying Binance...');
          _connectToBinance(symbol);
        },
        onDone: () {
          print('🔌 Finnhub connection closed');
          _connectToBinance(symbol);
        },
      );
      
      // Check connection
      Future.delayed(Duration(seconds: 3), () {
        if (!isConnected) {
          print('\n⏱️ No Finnhub data received');
          print('🔄 Switching to Binance...');
          _connectToBinance(symbol);
        } else {
          print('\n✅ Finnhub real-time feed active!');
        }
      });
      
    } catch (e) {
      print('\n❌ Finnhub connection failed: $e');
      _connectToBinance(symbol);
    }
  }
  
  void _connectToBinance(String symbol) {
    // Convert symbol format: BTC-USD -> btcusdt
    final binanceSymbol = symbol.toLowerCase().replaceAll('-usd', 'usdt').replaceAll('-', '');
    final wsUrl = 'wss://stream.binance.com:9443/ws/${binanceSymbol}@aggTrade';
    
    print('\n🚀 Connecting to Binance WebSocket for ultra-fast updates...');
    print('📍 URL: $wsUrl');
    print('🪙 Symbol: $binanceSymbol');
    
    try {
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
      
      bool isConnected = false;
      int messageCount = 0;
      
      _channel!.stream.listen(
        (data) {
          try {
            final Map<String, dynamic> message = json.decode(data);
            
            // Binance aggTrade format
            // {"e":"aggTrade","E":1234567890123,"s":"BTCUSDT","p":"10000.00","q":"0.01"}
            if (message['e'] == 'aggTrade') {
              isConnected = true;
              _isRealTimeData = true;
              
              final double price = double.parse(message['p']);
              _targetPrice = price;  // Set target for smooth interpolation
              
              messageCount++;
              
              // Always update the price immediately
              final now = DateTime.now();
              
              // Log every second (when milliseconds are close to 0)
              if (now.millisecondsSinceEpoch % 1000 < 100) {
                print('⚡ ${_currentSymbol}: \$${price.toStringAsFixed(2)} @ ${now.hour}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}');
              }
            }
          } catch (e) {
            print('Error parsing Binance data: $e');
            // Fallback to Coinbase
            if (!isConnected) {
              print('\n🔄 Switching to Coinbase WebSocket...');
              _connectToCoinbase(symbol);
            }
          }
        },
        onError: (error) {
          print('\n❌ WebSocket stream error: $error');
          print('🔄 Falling back to simulated data...');
          _isRealTimeData = false;
          _startSimulatedPrices();
        },
        onDone: () {
          print('🔌 Binance WebSocket closed, trying Coinbase...');
          _connectToCoinbase(symbol);
        },
        cancelOnError: false,
      );
      
      // Quick timeout for Binance, then try Coinbase
      Future.delayed(Duration(seconds: 2), () {
        if (!isConnected) {
          print('\n🔄 Binance timeout, switching to Coinbase...');
          _connectToCoinbase(symbol);
        } else {
          print('\n✅ Binance real-time connection established!');
          print('⚡ Receiving ultra-fast price updates');
        }
      });
      
    } catch (e) {
      print('\n❌ Binance connection failed: $e');
      print('🔄 Trying Coinbase...');
      _connectToCoinbase(symbol);
    }
  }
  
  void _connectToCoinbase(String symbol) {
    _disconnect();
    
    print('\n🔌 Connecting to Coinbase WebSocket...');
    print('📍 URL: $_coinbaseUrl');
    
    try {
      _channel = WebSocketChannel.connect(Uri.parse(_coinbaseUrl));
      
      // Subscribe to ticker and matches for maximum updates
      final subscribeMessage = {
        'type': 'subscribe',
        'product_ids': [symbol],
        'channels': ['ticker', 'matches', 'heartbeat']  // Multiple channels for reliability
      };
      
      _channel!.sink.add(json.encode(subscribeMessage));
      print('📤 Subscribing to Coinbase ticker & matches channels...');
      
      bool isConnected = false;
      int messageCount = 0;
      
      _channel!.stream.listen(
        (data) {
          try {
            final Map<String, dynamic> message = json.decode(data);
            
            // Handle different Coinbase message types
            if (message['type'] == 'ticker' && message['product_id'] == symbol) {
              isConnected = true;
              _isRealTimeData = true;
              
              final double price = double.parse(message['price']);
              _targetPrice = price;  // Set target for smooth interpolation
              
              messageCount++;
              // Log updates periodically
              final now = DateTime.now();
              if (now.millisecondsSinceEpoch % 1000 < 50) { // Log approximately once per second
                print('💱 ${symbol}: \$${price.toStringAsFixed(2)} @ ${now.hour}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')} (Coinbase)');
              }
            } else if (message['type'] == 'match' && message['product_id'] == symbol) {
              // Also handle match messages for more frequent updates
              isConnected = true;
              _isRealTimeData = true;
              
              final double price = double.parse(message['price']);
              _targetPrice = price;
            } else if (message['type'] == 'subscriptions') {
              print('✅ Coinbase subscription confirmed');
              final channels = message['channels'] ?? [];
              print('   Channels: $channels');
            } else if (message['type'] == 'heartbeat') {
              // Heartbeat keeps connection alive
            } else if (message['type'] == 'error') {
              print('❌ Coinbase error: ${message['message']}');
            }
          } catch (e) {
            print('Error parsing Coinbase data: $e');
            if (messageCount < 3) {
              print('Raw data: $data');
            }
          }
        },
        onError: (error) {
          print('\n❌ Coinbase error: $error');
          print('🔄 Using high-frequency simulated data');
          _startAggressiveSimulatedPrices();
        },
        onDone: () {
          print('🔌 Coinbase connection closed');
          print('🔄 Using simulated prices');
          _startAggressiveSimulatedPrices();
        },
      );
      
      // Quick fallback to simulated
      Future.delayed(Duration(seconds: 3), () {
        if (!isConnected) {
          print('\n⏱️ No real-time data received from Coinbase');
          print('📊 Message count: $messageCount');
          if (!_isRealTimeData) {
            print('🚀 Starting high-frequency simulated prices');
            _startAggressiveSimulatedPrices();
          }
        } else {
          print('\n✅ Coinbase real-time data active!');
        }
      });
      
    } catch (e) {
      print('\n❌ All connections failed: $e');
      print('🚀 Using high-frequency simulated data');
      _startAggressiveSimulatedPrices();
    }
  }
  
  void _disconnect() {
    // Stop all timers
    _smoothUpdateTimer?.cancel();
    _smoothUpdateTimer = null;
    _httpPollingTimer?.cancel();
    _httpPollingTimer = null;
    
    if (_channel != null) {
      // Unsubscribe before closing
      try {
        final unsubscribeTicker = {
          'type': 'unsubscribe',
          'channel': 'ticker',
          'product_ids': [_currentSymbol]
        };
        final unsubscribeHeartbeat = {
          'type': 'unsubscribe',
          'channel': 'heartbeats'
        };
        _channel!.sink.add(json.encode(unsubscribeTicker));
        _channel!.sink.add(json.encode(unsubscribeHeartbeat));
      } catch (e) {
        // Ignore errors during disconnect
      }
      _channel?.sink.close();
      _channel = null;
    }
  }
  
  // Fallback simulated prices if WebSocket fails
  Timer? _simulatedTimer;
  double _momentum = 0.0;
  final _random = Random();
  
  void _startAggressiveSimulatedPrices() {
    _simulatedTimer?.cancel();
    _simulatedTimer = null;
    
    _isRealTimeData = false;
    print('📊 Starting simulated prices (1 update/second)');
    
    // Set appropriate price ranges based on symbol
    double minPrice, maxPrice;
    switch (_currentSymbol) {
      case 'BTC-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 60000.0;
        minPrice = 50000.0;
        maxPrice = 70000.0;
        break;
      case 'ETH-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 3500.0;
        minPrice = 3000.0;
        maxPrice = 4000.0;
        break;
      case 'SOL-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 150.0;
        minPrice = 100.0;
        maxPrice = 200.0;
        break;
      case 'ADA-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 0.6;
        minPrice = 0.4;
        maxPrice = 0.8;
        break;
      case 'XRP-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 0.6;
        minPrice = 0.4;
        maxPrice = 0.8;
        break;
      case 'DOGE-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 0.08;
        minPrice = 0.06;
        maxPrice = 0.10;
        break;
      case 'MATIC-USD':
        _lastPrice = _lastPrice > 0 ? _lastPrice : 0.8;
        minPrice = 0.6;
        maxPrice = 1.0;
        break;
      default:
        minPrice = _lastPrice * 0.8;
        maxPrice = _lastPrice * 1.2;
    }
    
    // Update every second instead of every 100ms
    _simulatedTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      // Add momentum for more realistic movement
      _momentum = _momentum * 0.9 + (_random.nextDouble() - 0.5) * 0.2;
      
      // Calculate percentage change (more volatile)
      final volatility = 0.0005; // 0.05% base volatility
      final change = _momentum * volatility;
      
      // Apply change to target price
      _targetPrice = _targetPrice * (1 + change);
      
      // Add occasional jumps
      if (_random.nextDouble() < 0.05) { // 5% chance of jump
        final jump = (_random.nextDouble() - 0.5) * 0.003; // Up to 0.3% jump
        _targetPrice = _targetPrice * (1 + jump);
      }
      
      // Keep within bounds
      _targetPrice = _targetPrice.clamp(minPrice, maxPrice);
    });
  }
  
  // Standard simulated prices - just calls aggressive version
  void _startSimulatedPrices() {
    _startAggressiveSimulatedPrices();
  }
  
  void changeSymbol(String symbol) {
    print('\n🔄 Changing symbol to: $symbol');
    _simulatedTimer?.cancel();
    _simulatedTimer = null;
    _momentum = 0.0;
    
    // Reset price to appropriate level for the new symbol
    switch (symbol) {
      case 'BTC-USD':
        _lastPrice = 100000.0;
        _targetPrice = 100000.0;
        break;
      case 'ETH-USD':
        _lastPrice = 3500.0;
        _targetPrice = 3500.0;
        break;
      case 'SOL-USD':
        _lastPrice = 150.0;
        _targetPrice = 150.0;
        break;
      case 'ADA-USD':
        _lastPrice = 0.6;
        _targetPrice = 0.6;
        break;
      case 'XRP-USD':
        _lastPrice = 0.6;
        _targetPrice = 0.6;
        break;
      case 'DOGE-USD':
        _lastPrice = 0.08;
        _targetPrice = 0.08;
        break;
      case 'MATIC-USD':
        _lastPrice = 0.8;
        _targetPrice = 0.8;
        break;
    }
    
    connect(symbol: symbol);
  }
  
  void dispose() {
    _disconnect();
    _simulatedTimer?.cancel();
    _simulatedTimer = null;
    _smoothUpdateTimer?.cancel();
    _smoothUpdateTimer = null;
    _httpPollingTimer?.cancel();
    _httpPollingTimer = null;
    _priceController.close();
  }
  
  // Get available symbols (Coinbase format)
  static List<Map<String, String>> getAvailableSymbols() {
    return [
      {'symbol': 'BTC-USD', 'name': 'Bitcoin/USD'},
      {'symbol': 'ETH-USD', 'name': 'Ethereum/USD'},
      {'symbol': 'SOL-USD', 'name': 'Solana/USD'},
      {'symbol': 'ADA-USD', 'name': 'Cardano/USD'},
      {'symbol': 'XRP-USD', 'name': 'XRP/USD'},
      {'symbol': 'DOGE-USD', 'name': 'Dogecoin/USD'},
      {'symbol': 'MATIC-USD', 'name': 'Polygon/USD'},
    ];
  }
}
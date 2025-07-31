import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../widgets/scrolling_chart_widget.dart';
import '../../widgets/box_3d_widget.dart';
import '../../widgets/bonus_progress_bar.dart';
import '../../widgets/floating_text_animation.dart';
import '../../widgets/particle_explosion.dart';
import '../../widgets/game_result_overlay.dart';
import '../../widgets/animated_box_placement.dart';
import '../../widgets/chart_background_effects.dart';
import '../../services/price_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  List<AnimationController> _animationControllers = [];
  List<Animation<Offset>> _positionAnimations = [];
  
  List<Map<String, dynamic>> selectedBoxData = [];
  GlobalKey gridKey = GlobalKey();
  GlobalKey chartKey = GlobalKey();
  List<GlobalKey> boxKeys = [];
  
  // Trading related variables
  final PriceService _priceService = PriceService();
  StreamSubscription<double>? _priceSubscription;
  double _currentPrice = 100000.0; // Default Bitcoin price (updated)
  List<double> _priceHistory = [];
  final int _maxPriceHistory = 30; // Shorter history for more visible movement
  String _currentSymbol = 'BTC-USD';
  
  // Game state
  double _balance = 9440.4;
  double _score = 4949.6;
  double _bonusProgress = 0.5; // 25/50
  int _bonusCurrent = 25;
  int _bonusMax = 50;
  double _multiplier = 1.0;
  
  // Box price control
  double _boxPrice = 0.0001;
  int _boxQuantity = 1;
  
  // Price levels for placement
  List<double> _priceLevels = [];
  int _selectedPriceLevel = 3; // Default to middle (current price)
  
  // Game mechanics
  int _combo = 0;
  List<Widget> _floatingTexts = [];
  List<Widget> _particles = [];
  Timer? _comboTimer;
  bool _gameOver = false;
  double _initialBalance = 9440.4;
  double _targetScore = 10000.0;

  // Generate a single random box with new color scheme
  Map<String, dynamic> generateRandomBox() {
    final random = Random();
    List<Color> colors = [
      BoxColors.green,
      BoxColors.purple,
      BoxColors.pink,
      BoxColors.orange,
      BoxColors.blue,
      BoxColors.grey,
    ];
    
    // Generate values like in the image: 1, 1.5, 2, 2.6, 3.3, etc.
    List<String> possibleValues = [
      '1', '1.3', '1.5', '2', '2.6', '2.7', '3.3', '3.4', '3.8', '4', '5.2'
    ];
    
    return {
      'value': possibleValues[random.nextInt(possibleValues.length)],
      'color': colors[random.nextInt(colors.length)],
    };
  }

  late List<Map<String, dynamic>> boxData;

  @override
  void initState() {
    super.initState();
    const int count = 13; // Exactly 13 boxes
    boxKeys = List.generate(count, (index) => GlobalKey());
    _animationControllers = List.generate(count, (index) => AnimationController(
      duration: const Duration(milliseconds: 100), // Very fast animation
      vsync: this,
    ));
    _positionAnimations = List.generate(count, (index) => Tween<Offset>(
      begin: Offset.zero,
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationControllers[index],
      curve: Curves.easeOutQuad, // Smoother curve
    )));
    
    boxData = List.generate(count, (index) => generateRandomBox());
    
    // Initialize with some default price history
    _priceHistory = List<double>.from(List.generate(_maxPriceHistory, (index) => _currentPrice));
    
    // Connect to real-time price data
    _priceService.connect(symbol: _currentSymbol);
    
    // Subscribe to price updates
    _priceSubscription = _priceService.priceStream.listen((price) {
      setState(() {
        _currentPrice = price;
        _priceHistory.add(price);
        if (_priceHistory.length > _maxPriceHistory) {
          _priceHistory.removeAt(0);
        }
        
        // Update price levels based on current price
        _updatePriceLevels();
        
        // Check for price hits
        _checkPriceHits();
        
        // Check box timeouts
        _checkBoxTimeouts();
        
        // Check game status
        _checkGameStatus();
      });
    });
  }

  @override
  void dispose() {
    _priceSubscription?.cancel();
    _priceService.dispose();
    _comboTimer?.cancel();
    for (var controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }
  
  void _updatePriceLevels() {
    // Update price levels based on current price
    // For crypto prices, use percentage-based levels
    final levelSpacing = _currentPrice * 0.001; // 0.1% spacing
    _priceLevels = [
      _currentPrice - (levelSpacing * 3),  // -0.3%
      _currentPrice - (levelSpacing * 2),  // -0.2%
      _currentPrice - levelSpacing,        // -0.1%
      _currentPrice,                       // Current price
      _currentPrice + levelSpacing,        // +0.1%
      _currentPrice + (levelSpacing * 2),  // +0.2%
      _currentPrice + (levelSpacing * 3),  // +0.3%
    ];
  }

  double _getPriceRange() {
    if (_priceHistory.isEmpty) return 1.0;
    final minPrice = _priceHistory.reduce((a, b) => a < b ? a : b);
    final maxPrice = _priceHistory.reduce((a, b) => a > b ? a : b);
    var range = maxPrice - minPrice;
    if (range == 0) range = _currentPrice * 0.005; // 0.5% of current price
    return range;
  }

  void _onBoxTapped(int index) {
    if (_gameOver) return;

    // Quick check for balance first
    final selectedBoxInfo = Map<String, dynamic>.from(boxData[index]);
    final cost = double.parse(selectedBoxInfo['value']) * 10;
    
    if (_balance < cost) {
      // Not enough balance - quick exit
      return;
    }
    
    // Get positions quickly
    final RenderBox? boxRenderBox = boxKeys[index].currentContext?.findRenderObject() as RenderBox?;
    if (boxRenderBox == null) return;
    
    final boxPosition = boxRenderBox.localToGlobal(Offset.zero);
    final boxCenterY = boxPosition.dy + (boxRenderBox.size.height / 2);
    
    // Calculate Y position
    final RenderBox? chartRenderBox = chartKey.currentContext?.findRenderObject() as RenderBox?;
    final chartY = chartRenderBox?.localToGlobal(Offset.zero).dy ?? 130.0;
    selectedBoxInfo['screenY'] = boxCenterY - chartY - 20.0; // 20 is chart padding
    selectedBoxInfo['timestamp'] = DateTime.now().millisecondsSinceEpoch;
    selectedBoxInfo['animated'] = true;
    selectedBoxInfo['priceAtPlacement'] = _currentPrice; // Store current price when box is placed
    
    // Single setState for all changes
    setState(() {
      _balance -= cost;
      
      selectedBoxData.add(selectedBoxInfo);
      
      // Replace box immediately
      boxData[index] = generateRandomBox();
    });
    
    // No need to show deduction amount
  }
  
  
  void _showFloatingText(String text, Offset position, Color color, {double? fontSize}) {
    final key = GlobalKey();
    final floatingText = FloatingTextAnimation(
      key: key,
      text: text,
      startPosition: position,
      color: color,
      fontSize: fontSize,
      onComplete: () {
        setState(() {
          _floatingTexts.removeWhere((widget) => widget.key == key);
        });
      },
    );
    
    setState(() {
      _floatingTexts.add(floatingText);
    });
  }
  
  void _showParticleExplosion(Offset position, Color color) {
    final key = GlobalKey();
    final particles = ParticleExplosion(
      key: key,
      center: position,
      color: color,
      onComplete: () {
        setState(() {
          _particles.removeWhere((widget) => widget.key == key);
        });
      },
    );
    
    setState(() {
      _particles.add(particles);
    });
  }
  
  
  void _checkPriceHits() {
    final List<int> toRemove = [];
    
    for (int i = 0; i < selectedBoxData.length; i++) {
      final box = selectedBoxData[i];
      
      // Process hits that were detected in the chart painter
      if (box['hit'] == true && box['processed'] != true) {
        box['processed'] = true;
        
        // Calculate reward
        final boxValue = double.parse(box['value']);
        final reward = boxValue * 50; // Base reward
        final profit = reward * _multiplier;
        
        // Update balance and score
        setState(() {
          _balance += profit;
          _score += profit * 10;
          
          // Update bonus - 1 point per hit
          _bonusCurrent = (_bonusCurrent + 1).clamp(0, _bonusMax);
          _bonusProgress = _bonusCurrent / _bonusMax;
        });
        
        // Show effects at center of chart area
        final screenSize = MediaQuery.of(context).size;
        final centerX = screenSize.width * 0.85 / 2; // Center of chart area
        final centerY = screenSize.height * 0.5; // Center of chart area
        final position = Offset(centerX, centerY);
        
        _showFloatingText('+\$${profit.toStringAsFixed(0)}', position, Colors.greenAccent);
        _showParticleExplosion(position, box['color'] as Color);
        
        // Increment combo
        _combo++;
        _multiplier = 1.0 + (_combo * 0.2);
        
        // Reset combo timer
        _comboTimer?.cancel();
        _comboTimer = Timer(const Duration(seconds: 5), () {
          setState(() {
            _combo = 0;
            _multiplier = 1.0;
          });
        });
      }
      
      // Process misses
      if (box['missed'] == true && box['missProcessed'] != true) {
        box['missProcessed'] = true;
        
        // Reset combo on miss
        setState(() {
          _combo = 0;
          _multiplier = 1.0;
        });
        
        // Show miss feedback at bottom left, above box price control
        // Box price control is at bottom: 20, with padding: 12, so total height ~60px
        // Place text above that
        final leftX = 40.0; // Left side position
        final bottomY = MediaQuery.of(context).size.height * 0.85 - 150.0; // Moved higher up
        final position = Offset(leftX, bottomY);
        
        _showFloatingText('MISS!', position, Colors.redAccent, fontSize: 14);
        
        // Deduct a small penalty for missing
        final penalty = 10.0;
        setState(() {
          _balance -= penalty;
        });
        _showFloatingText('-\$${penalty.toStringAsFixed(0)}', 
          Offset(leftX, bottomY + 20), Colors.redAccent.withOpacity(0.7), fontSize: 12);
      }
      
      // Remove boxes that have scrolled off screen or are marked as offScreen
      if (box['offScreen'] == true) {
        toRemove.add(i);
      } else if (box['timestamp'] != null) {
        final boxTime = box['timestamp'] as int;
        final currentTime = DateTime.now().millisecondsSinceEpoch;
        final timeDiff = currentTime - boxTime;
        
        // Remove boxes that have been missed and are off screen (more than 10 seconds old)
        if (box['missed'] == true && timeDiff > 10000) {
          toRemove.add(i);
        }
      }
    }
    
    // Remove boxes in reverse order to maintain indices
    for (int i = toRemove.length - 1; i >= 0; i--) {
      final index = toRemove[i];
      selectedBoxData.removeAt(index);
    }
  }
  
  void _checkBoxTimeouts() {
    // Box timeout is now handled in _checkPriceHits
    // This function is kept for compatibility but currently does nothing
  }
  
  Offset _calculateChartPosition(double price, double chartAreaHeight) {
    final headerHeight = 80.0;
    final bonusBarHeight = 50.0;
    final chartPadding = 20.0;
    
    double minPrice = _priceHistory.reduce((a, b) => a < b ? a : b);
    double maxPrice = _priceHistory.reduce((a, b) => a > b ? a : b);
    double priceRange = maxPrice - minPrice;
    if (priceRange == 0) priceRange = 1;
    
    minPrice -= priceRange * 0.1;
    maxPrice += priceRange * 0.1;
    priceRange = maxPrice - minPrice;
    
    final normalizedPrice = (price - minPrice) / priceRange;
    final chartHeight = chartAreaHeight - headerHeight - bonusBarHeight - (chartPadding * 2);
    final chartY = headerHeight + bonusBarHeight + chartPadding + 
                   (chartHeight - (normalizedPrice * chartHeight));
    
    final screenWidth = MediaQuery.of(context).size.width;
    final chartX = screenWidth - 60;
    
    return Offset(chartX, chartY);
  }
  
  void _checkGameStatus() {
    // Game over only when bonus bar is full
    if (_bonusCurrent >= _bonusMax && !_gameOver) {
      setState(() {
        _gameOver = true;
      });
      // Win if balance is positive, lose if negative
      _showGameResult(_balance > _initialBalance);
    }
  }
  
  void _showGameResult(bool isWin) {
    final profit = _balance - _initialBalance;
    
    // Add a delay before showing the overlay for a better transition
    Future.delayed(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      
      showDialog(
        context: context,
        barrierDismissible: false,
        barrierColor: Colors.transparent,
        builder: (context) => GameResultOverlay(
          isWin: isWin,
          score: _score,
          profit: profit,
          onPlayAgain: () {
            Navigator.of(context).pop();
            _resetGame();
          },
        ),
      );
    });
  }
  
  void _resetGame() {
    setState(() {
      _gameOver = false;
      _score = 4949.6;
      _balance = _initialBalance;
      _combo = 0;
      _multiplier = 1.0;
      _bonusCurrent = 25;
      _bonusProgress = _bonusCurrent / _bonusMax;
      selectedBoxData.clear();
      _floatingTexts.clear();
      _particles.clear();
      
      // Reset all animations
      for (var controller in _animationControllers) {
        controller.reset();
      }
      
      // Generate new boxes
      boxData = List.generate(13, (index) => generateRandomBox());
    });
  }

  Widget _buildBox(int index) {
    final item = boxData[index];

    return GestureDetector(
      key: boxKeys[index],
      onTap: () => _onBoxTapped(index),
      behavior: HitTestBehavior.opaque, // Improve tap response
      child: Box3DWidget(
        value: item['value'],
        color: item['color'],
        isSelected: false,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A2E),
      body: SafeArea(
        child: Column(
          children: [
            // Header bar at the top
            Container(
              height: 80,
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(CupertinoIcons.person_circle_fill, color: Colors.white, size: 28),
                        SizedBox(height: 2),
                        Text('ACCOUNT', style: TextStyle(color: Colors.white54, fontSize: 9)),
                      ],
                    ),
                  ),
                  Flexible(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        FittedBox(
                          child: Text(_score.toStringAsFixed(1).replaceAll('.', ','),
                              style: const TextStyle(
                                color: CupertinoColors.activeGreen,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              )),
                        ),
                        const SizedBox(height: 2),
                        const Text('SCORE', style: TextStyle(color: Colors.white54, fontSize: 9)),
                      ],
                    ),
                  ),
                  Flexible(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        FittedBox(
                          child: Text(_balance.toStringAsFixed(1).replaceAll('.', ','),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              )),
                        ),
                        const SizedBox(height: 2),
                        const Text('BALANCE', style: TextStyle(color: Colors.white54, fontSize: 9)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Main content area
            Expanded(
              child: Column(
                children: [
                  // Bonus progress bar - full width
                  BonusProgressBar(
                    progress: _bonusProgress,
                    currentValue: _bonusCurrent.toString(),
                    maxValue: _bonusMax.toString(),
                  ),
                  
                  // Symbol selector
                  Container(
                    height: 40,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                    child: Row(
                      children: [
                        const Text(
                          'SYMBOL:',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.2),
                                width: 1,
                              ),
                            ),
                            child: DropdownButton<String>(
                              value: _currentSymbol,
                              dropdownColor: const Color(0xFF1A1A2E),
                              underline: Container(),
                              icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                              isDense: true,
                              isExpanded: true,
                              items: PriceService.getAvailableSymbols().map((symbol) {
                                return DropdownMenuItem<String>(
                                  value: symbol['symbol'],
                                  child: Text(symbol['name']!),
                                );
                              }).toList(),
                              onChanged: (String? newSymbol) {
                                if (newSymbol != null && newSymbol != _currentSymbol) {
                                  setState(() {
                                    _currentSymbol = newSymbol;
                                    
                                    // Reset price based on symbol
                                    switch (newSymbol) {
                                      case 'BTC-USD':
                                        _currentPrice = 100000.0;
                                        break;
                                      case 'ETH-USD':
                                        _currentPrice = 3500.0;
                                        break;
                                      case 'SOL-USD':
                                        _currentPrice = 150.0;
                                        break;
                                      case 'ADA-USD':
                                        _currentPrice = 0.6;
                                        break;
                                      case 'XRP-USD':
                                        _currentPrice = 0.6;
                                        break;
                                      case 'DOGE-USD':
                                        _currentPrice = 0.08;
                                        break;
                                      case 'MATIC-USD':
                                        _currentPrice = 0.8;
                                        break;
                                    }
                                    
                                    // Clear price history and reset with new price
                                    _priceHistory.clear();
                                    _priceHistory = List<double>.from(List.generate(_maxPriceHistory, (index) => _currentPrice));
                                    
                                    // Clear placed boxes
                                    selectedBoxData.clear();
                                    
                                    // Change symbol in service
                                    _priceService.changeSymbol(newSymbol);
                                  });
                                }
                              },
                            ),
                          ),
                        ),
                        const SizedBox(width: 15),
                        Flexible(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _priceService.isRealTimeData ? Icons.wifi : Icons.trending_up,
                                color: _priceService.isRealTimeData ? Colors.greenAccent : Colors.orangeAccent,
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '\$${_currentPrice.toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        color: Colors.cyanAccent,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      _priceService.isRealTimeData ? 'Coinbase' : 'Simulated',
                                      style: TextStyle(
                                        color: Colors.white.withOpacity(0.5),
                                        fontSize: 9,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // 85/15 split below bonus bar
                  Expanded(
                    child: Stack(
                      children: [
                        Row(
                          children: [
                            // Chart area - 85%
                            Expanded(
                              flex: 85,
                              child: Stack(
                                children: [
                                  // Background effects that move with price
                                  ChartBackgroundEffects(
                                    priceOffset: _priceHistory.isNotEmpty 
                                        ? (_currentPrice - _priceHistory.first) / _currentPrice 
                                        : 0.0,
                                  ),
                                  
                                  // Smooth line chart background
                                  Padding(
                                    key: chartKey,
                                    padding: const EdgeInsets.all(20),
                                    child: ScrollingChartWidget(
                                      priceHistory: _priceHistory,
                                      currentPrice: _currentPrice,
                                      placedBoxes: selectedBoxData,
                                      priceLevels: _priceLevels,
                                      selectedPriceLevel: _selectedPriceLevel,
                                      chartTopOffset: 0, // Will calculate dynamically
                                    ),
                                  ),
                            
                            // Box price control at bottom left
                            Positioned(
                              bottom: 20,
                              left: 20,
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.3),
                                  borderRadius: BorderRadius.circular(15),
                                  border: Border.all(
                                    color: Colors.white.withOpacity(0.1),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    // Minus button
                                    GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _boxPrice = (_boxPrice - 0.0001).clamp(0.0001, 1.0);
                                        });
                                      },
                                      child: Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: Colors.redAccent.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(
                                            color: Colors.redAccent.withOpacity(0.2),
                                            width: 1,
                                          ),
                                        ),
                                        child: const Center(
                                          child: Icon(
                                            Icons.remove,
                                            color: Colors.white,
                                            size: 18,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    // Price display
                                    Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'BOX PRICE',
                                          style: TextStyle(
                                            color: Colors.white.withOpacity(0.5),
                                            fontSize: 9,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          '\$${_boxPrice.toStringAsFixed(4)}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(width: 16),
                                    // Plus button
                                    GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _boxPrice = (_boxPrice + 0.0001).clamp(0.0001, 1.0);
                                        });
                                      },
                                      child: Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: Colors.greenAccent.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(
                                            color: Colors.greenAccent.withOpacity(0.2),
                                            width: 1,
                                          ),
                                        ),
                                        child: const Center(
                                          child: Icon(
                                            Icons.add,
                                            color: Colors.white,
                                            size: 18,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                                ],
                              ),
                            ),
                      
                      // Box column - 15%
                      Expanded(
                        flex: 15,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                const Color(0xFF1A1A2E),
                                const Color(0xFF0F0F1E),
                              ],
                            ),
                            border: Border(
                              left: BorderSide(
                                color: Colors.white.withOpacity(0.1),
                                width: 1,
                              ),
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: List.generate(boxData.length, (index) {
                              return Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4.0,
                                    vertical: 1.0,
                                  ),
                                  child: _buildBox(index),
                                ),
                              );
                            }),
                          ),
                        ),
                            ),
                          ],
                        ),
                        // Particle effects
                        ..._particles,
                        
                        // Floating text animations
                        ..._floatingTexts,
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../widgets/candlestick_chart_widget.dart';
import '../../widgets/box_3d_widget.dart';
import '../../widgets/bonus_progress_bar.dart';
import '../../widgets/floating_text_animation.dart';
import '../../widgets/particle_explosion.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  List<AnimationController> _animationControllers = [];
  List<Animation<Offset>> _positionAnimations = [];
  
  List<int> selectedIndices = [];
  List<Map<String, dynamic>> selectedBoxData = [];
  GlobalKey gridKey = GlobalKey();
  List<GlobalKey> boxKeys = [];
  static const int maxCenterBoxes = 6;
  
  // Trading related variables
  Timer? _priceTimer;
  double _currentPrice = 100.0;
  List<CandleData> _candles = [];
  final int _maxCandles = 30;
  double _lastPrice = 100.0;
  
  // Game state
  double _balance = 9440.4;
  double _score = 4949.6;
  double _bonusProgress = 0.5; // 25/50
  int _bonusCurrent = 25;
  int _bonusMax = 50;
  double _multiplier = 2.0;
  
  // Box price control
  double _boxPrice = 0.0001;
  int _boxQuantity = 1;
  
  // Game mechanics
  int _combo = 0;
  List<Widget> _floatingTexts = [];
  List<Widget> _particles = [];
  bool _isProcessingMatch = false;
  Timer? _comboTimer;

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
    const int count = 54;
    boxKeys = List.generate(count, (index) => GlobalKey());
    _animationControllers = List.generate(count, (index) => AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    ));
    _positionAnimations = List.generate(count, (index) => Tween<Offset>(
      begin: Offset.zero,
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationControllers[index],
      curve: Curves.easeInOutCubic,
    )));
    
    boxData = List.generate(count, (index) => generateRandomBox());
    
    // Initialize candles
    _initializeCandles();
    
    // Start price updates
    _startPriceUpdates();
  }

  @override
  void dispose() {
    _priceTimer?.cancel();
    _comboTimer?.cancel();
    for (var controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }
  
  void _initializeCandles() {
    final now = DateTime.now();
    for (int i = _maxCandles; i > 0; i--) {
      final time = now.subtract(Duration(seconds: i));
      _candles.add(CandleData(
        open: _currentPrice,
        close: _currentPrice,
        high: _currentPrice + 0.5,
        low: _currentPrice - 0.5,
        time: time,
      ));
    }
  }
  
  void _startPriceUpdates() {
    _priceTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        // Generate realistic price movement
        final random = Random();
        final change = (random.nextDouble() - 0.5) * 2;
        final volatility = 0.5;
        
        _lastPrice = _currentPrice;
        _currentPrice = _currentPrice * (1 + change * volatility / 100);
        _currentPrice = _currentPrice.clamp(50.0, 200.0);
        
        // Create new candle
        final high = max(_lastPrice, _currentPrice) + random.nextDouble() * 0.5;
        final low = min(_lastPrice, _currentPrice) - random.nextDouble() * 0.5;
        
        _candles.add(CandleData(
          open: _lastPrice,
          close: _currentPrice,
          high: high,
          low: low,
          time: DateTime.now(),
        ));
        
        if (_candles.length > _maxCandles) {
          _candles.removeAt(0);
        }
      });
    });
  }

  void _onBoxTapped(int index) {
    if (selectedIndices.contains(index) || _isProcessingMatch) return;

    final selectedBoxInfo = Map<String, dynamic>.from(boxData[index]);
    selectedBoxInfo['price'] = _currentPrice;
    selectedBoxInfo['timestamp'] = DateTime.now().millisecondsSinceEpoch;
    
    final RenderBox? boxRenderBox = boxKeys[index].currentContext?.findRenderObject() as RenderBox?;
    if (boxRenderBox == null) return;

    final boxPosition = boxRenderBox.localToGlobal(Offset.zero);
    final boxSize = boxRenderBox.size;

    setState(() {
      // Check if this box matches with any existing selected boxes
      bool foundMatch = false;
      int matchIndex = -1;
      
      for (int i = 0; i < selectedBoxData.length; i++) {
        if (selectedBoxData[i]['value'] == selectedBoxInfo['value']) {
          foundMatch = true;
          matchIndex = i;
          break;
        }
      }
      
      if (foundMatch) {
        // Process match
        _processMatch(selectedBoxInfo, matchIndex, boxPosition);
      } else {
        // Normal selection - costs money to place box
        final cost = double.parse(selectedBoxInfo['value']) * 10;
        if (_balance >= cost) {
          _balance -= cost;
          
          if (selectedIndices.length >= maxCenterBoxes) {
            final removedIndex = selectedIndices.removeAt(0);
            selectedBoxData.removeAt(0);
            _animationControllers[removedIndex].reset();
          }

          selectedIndices.add(index);
          selectedBoxData.add(selectedBoxInfo);
          
          // Show cost
          _showFloatingText('-\$${cost.toStringAsFixed(0)}', boxPosition, Colors.redAccent);
        } else {
          // Not enough balance
          _showFloatingText('Not enough balance!', boxPosition, Colors.red);
          return;
        }
      }

      // Replace tapped grid box with new one
      boxData[index] = generateRandomBox();
    });

    // Animate box
    _animationControllers[index].forward(from: 0);
  }
  
  void _processMatch(Map<String, dynamic> newBox, int matchIndex, Offset position) {
    _isProcessingMatch = true;
    
    // Calculate points
    final double boxValue = double.parse(newBox['value']);
    final double multiplierBonus = boxValue * _multiplier;
    final double comboBonus = _combo * 0.5;
    final double totalPoints = (boxValue + multiplierBonus + comboBonus) * 100;
    
    // Update score, balance and combo
    setState(() {
      _score += totalPoints;
      _balance += totalPoints / 100; // Convert points to currency
      _combo++;
      _multiplier = 1.0 + (_combo * 0.5);
      _bonusCurrent = (_bonusCurrent + 1).clamp(0, _bonusMax);
      _bonusProgress = _bonusCurrent / _bonusMax;
      
      // Remove matched box from selected
      if (matchIndex < selectedIndices.length) {
        final removedIndex = selectedIndices.removeAt(matchIndex);
        selectedBoxData.removeAt(matchIndex);
        _animationControllers[removedIndex].reset();
      }
    });
    
    // Show effects
    _showFloatingText('+${totalPoints.toStringAsFixed(0)}', position, Colors.greenAccent);
    _showParticleExplosion(position, newBox['color'] as Color);
    
    if (_combo > 1) {
      _showFloatingText('COMBO x$_combo', 
        Offset(position.dx, position.dy + 30), 
        Colors.yellowAccent);
    }
    
    // Reset combo timer
    _comboTimer?.cancel();
    _comboTimer = Timer(const Duration(seconds: 3), () {
      setState(() {
        _combo = 0;
        _multiplier = 1.0;
      });
    });
    
    // Check for cascade
    _checkForCascade();
    
    // Reset processing flag after animation
    Future.delayed(const Duration(milliseconds: 300), () {
      _isProcessingMatch = false;
    });
  }
  
  void _showFloatingText(String text, Offset position, Color color) {
    final key = GlobalKey();
    final floatingText = FloatingTextAnimation(
      key: key,
      text: text,
      startPosition: position,
      color: color,
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
  
  void _checkForCascade() {
    // Check if any boxes in the grid match selected boxes
    Future.delayed(const Duration(milliseconds: 100), () {
      for (int i = 0; i < boxData.length; i++) {
        if (!selectedIndices.contains(i)) {
          for (var selectedBox in selectedBoxData) {
            if (boxData[i]['value'] == selectedBox['value']) {
              // Auto-select matching box for cascade effect
              _onBoxTapped(i);
              return;
            }
          }
        }
      }
    });
  }

  Widget _buildBox(int index) {
    final item = boxData[index];
    final isSelected = selectedIndices.contains(index);

    return GestureDetector(
      key: boxKeys[index],
      onTap: () => _onBoxTapped(index),
      child: AnimatedBuilder(
        animation: _animationControllers[index],
        builder: (context, child) {
          Widget boxWidget = Box3DWidget(
            value: item['value'],
            color: item['color'],
            isSelected: isSelected,
          );

          if (isSelected && _animationControllers[index].value > 0) {
            return Opacity(
              opacity: 1 - _animationControllers[index].value,
              child: Transform.scale(
                scale: 1 - (_animationControllers[index].value * 0.3),
                child: boxWidget,
              ),
            );
          }
          
          return boxWidget;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A2E),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header bar
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

                // Chart and game area
                Expanded(
                  flex: 6,
                  child: Stack(
                    children: [
                      // Candlestick chart background
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: CandlestickChartWidget(
                          candles: _candles,
                          currentPrice: _currentPrice,
                          placedBoxes: selectedBoxData,
                        ),
                      ),
                      
                      // Bonus progress bar
                      Positioned(
                        top: 0,
                        left: 0,
                        right: 0,
                        child: BonusProgressBar(
                          progress: _bonusProgress,
                          currentValue: _bonusCurrent.toString(),
                          maxValue: _bonusMax.toString(),
                        ),
                      ),
                      
                      // Multiplier display
                      if (_multiplier > 1)
                        Positioned(
                          top: 60,
                          left: 0,
                          right: 0,
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.7),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '+${_multiplier.toStringAsFixed(1)}',
                                style: const TextStyle(
                                  color: Colors.yellowAccent,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                      
                      // Stacked boxes in center
                      if (selectedBoxData.isNotEmpty)
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const SizedBox(height: 80),
                              ...selectedBoxData.asMap().entries.map((entry) {
                                final index = entry.key;
                                final data = entry.value;
                                return Transform.translate(
                                  offset: Offset(0, -index * 10.0),
                                  child: Box3DWidget(
                                    value: data['value'],
                                    color: data['color'],
                                    width: 80,
                                    height: 80,
                                  ),
                                );
                              }).toList(),
                            ],
                          ),
                        ),
                      
                      // Gold coins animation points
                      ...List.generate(5, (index) {
                        final random = Random();
                        return Positioned(
                          top: 100 + random.nextDouble() * 200,
                          right: 50 + random.nextDouble() * 100,
                          child: Icon(
                            Icons.monetization_on,
                            color: Colors.yellowAccent.withOpacity(0.7),
                            size: 20,
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                // Grid (40%)
                Expanded(
                  flex: 4,
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
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          int columns = 9;
                          return GridView.builder(
                            key: gridKey,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: boxData.length,
                            padding: EdgeInsets.zero,
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: columns,
                              crossAxisSpacing: 4,
                              mainAxisSpacing: 4,
                              childAspectRatio: 1,
                            ),
                            itemBuilder: (context, index) {
                              return _buildBox(index);
                            },
                          );
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Bottom control panel
            Positioned(
              bottom: MediaQuery.of(context).size.height * 0.4 + 10,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A3E),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'BOX PRICE',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\$${_boxPrice.toStringAsFixed(5)}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFF1A1A2E),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove, color: Colors.white54),
                                onPressed: () {
                                  setState(() {
                                    if (_boxQuantity > 1) _boxQuantity--;
                                  });
                                },
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 15),
                                child: Text(
                                  _boxQuantity.toString(),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add, color: Colors.white54),
                                onPressed: () {
                                  setState(() {
                                    _boxQuantity++;
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            // Particle effects
            ..._particles,
            
            // Floating text animations
            ..._floatingTexts,
          ],
        ),
      ),
    );
  }
}

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
  List<double> _priceHistory = [];
  final int _maxPriceHistory = 15; // Much fewer points for very wide X steps
  
  // Square wave pattern variables
  int _holdCounter = 0;
  int _holdDuration = 2; // Hold for 2 ticks (0.2 seconds)
  double _targetPrice = 100.0;
  List<double> _priceTargets = [98.5, 99.0, 99.5, 100.0, 100.5, 101.0, 101.5]; // Possible price levels
  int _lastPriceIndex = 3; // Start at middle (100.0)
  
  // Game state
  double _balance = 9440.4;
  double _score = 4949.6;
  double _bonusProgress = 0.47; // 47/125
  int _bonusCurrent = 47;
  int _bonusMax = 125;
  double _multiplier = 1.0;
  
  // Box price control
  double _boxPrice = 0.0001;
  int _boxQuantity = 1;
  
  // Price levels for placement
  List<double> _priceLevels = [];
  int _selectedPriceLevel = 2; // Default to middle (current price)
  
  // Game mechanics
  int _combo = 0;
  List<Widget> _floatingTexts = [];
  List<Widget> _particles = [];
  List<Widget> _animatedBoxPlacements = [];
  bool _isProcessingMatch = false;
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
    const int count = 63; // 9 columns x 7 rows
    boxKeys = List.generate(count, (index) => GlobalKey());
    _animationControllers = List.generate(count, (index) => AnimationController(
      duration: const Duration(milliseconds: 200), // Faster animation
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
    
    // Initialize price history with random movement
    final random = Random();
    _priceHistory = [];
    double lastPrice = _currentPrice;
    
    for (int i = 0; i < _maxPriceHistory; i++) {
      if (i % 3 == 0 && i > 0) {
        // Jump to random level every 3 points
        lastPrice = _priceTargets[random.nextInt(_priceTargets.length)];
      }
      _priceHistory.add(lastPrice);
    }
    
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
  
  void _startPriceUpdates() {
    _priceTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      setState(() {
        // Square wave pattern
        if (_holdCounter >= _holdDuration) {
          // Time to jump to a new level
          final random = Random();
          
          // Create dummy data to fill entire height - pick random jumps
          // Favor extreme values to use full range
          List<int> possibleJumps = [-3, -2, -1, 1, 2, 3];
          if (_lastPriceIndex <= 1) {
            // Near bottom, favor upward jumps
            possibleJumps = [1, 2, 3, 4, 5];
          } else if (_lastPriceIndex >= 5) {
            // Near top, favor downward jumps
            possibleJumps = [-5, -4, -3, -2, -1];
          }
          
          final jump = possibleJumps[random.nextInt(possibleJumps.length)];
          _lastPriceIndex = (_lastPriceIndex + jump).clamp(0, 6);
          
          // Instant jump to new price
          _currentPrice = _priceTargets[_lastPriceIndex];
          _holdCounter = 0;
          
          // Randomize next hold duration (1-3 ticks)
          _holdDuration = random.nextInt(3) + 1;
        } else {
          // Hold at current level
          _holdCounter++;
        }
        
        // Update price history
        _priceHistory.add(_currentPrice);
        if (_priceHistory.length > _maxPriceHistory) {
          _priceHistory.removeAt(0);
        }
        
        // Update price levels (7 levels)
        _priceLevels = [
          _currentPrice - 1.5,  // -1.5
          _currentPrice - 1.0,  // -1
          _currentPrice - 0.5,  // -0.5
          _currentPrice,        // 0
          _currentPrice + 0.5,  // +0.5
          _currentPrice + 1.0,  // +1
          _currentPrice + 1.5,  // +1.5
        ];
        
        // Check for price hits on placed boxes
        _checkPriceHits();
        
        // Check box timeouts
        _checkBoxTimeouts();
        
        // Check win/lose conditions
        _checkGameStatus();
      });
    });
  }

  void _onBoxTapped(int index) {
    if (selectedIndices.contains(index) || _isProcessingMatch || _gameOver) return;

    final selectedBoxInfo = Map<String, dynamic>.from(boxData[index]);
    
    // Calculate which row the box is in (0-6)
    final row = index ~/ 9; // 9 columns per row
    
    // Map row to price level: row 0 = +1.5, row 1 = +1, row 2 = +0.5, row 3 = 0, row 4 = -0.5, row 5 = -1, row 6 = -1.5
    final priceLevelMap = [6, 5, 4, 3, 2, 1, 0]; // Reverse mapping for top to bottom
    final priceLevel = priceLevelMap[row];
    
    // Initialize price levels if empty
    if (_priceLevels.isEmpty) {
      _priceLevels = [
        _currentPrice - 1.5,  // -1.5
        _currentPrice - 1.0,  // -1
        _currentPrice - 0.5,  // -0.5
        _currentPrice,        // 0
        _currentPrice + 0.5,  // +0.5
        _currentPrice + 1.0,  // +1
        _currentPrice + 1.5,  // +1.5
      ];
    }
    
    selectedBoxInfo['price'] = _priceLevels[priceLevel];
    selectedBoxInfo['timestamp'] = DateTime.now().millisecondsSinceEpoch;
    
    final RenderBox? boxRenderBox = boxKeys[index].currentContext?.findRenderObject() as RenderBox?;
    if (boxRenderBox == null) return;

    final boxPosition = boxRenderBox.localToGlobal(Offset.zero);
    final boxSize = boxRenderBox.size;

    // Normal selection - costs money to place box
    final cost = double.parse(selectedBoxInfo['value']) * 10;
    if (_balance >= cost) {
      setState(() {
        _balance -= cost;
        
        if (selectedIndices.length >= maxCenterBoxes) {
          final removedIndex = selectedIndices.removeAt(0);
          selectedBoxData.removeAt(0);
          _animationControllers[removedIndex].reset();
        }

        selectedIndices.add(index);
        selectedBoxData.add(selectedBoxInfo);
      });
      
      // Calculate chart position for animation
      _animateBoxToChart(selectedBoxInfo, boxPosition);
      
      // Show cost
      _showFloatingText('-\$${cost.toStringAsFixed(0)}', boxPosition, Colors.redAccent);
    } else {
      // Not enough balance
      _showFloatingText('Not enough balance!', boxPosition, Colors.red);
      return;
    }

    setState(() {
      // Replace tapped grid box with new one
      boxData[index] = generateRandomBox();
    });

    // Animate box
    _animationControllers[index].forward(from: 0);
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
  
  
  void _animateBoxToChart(Map<String, dynamic> boxInfo, Offset startPosition) {
    // Calculate the end position on the chart
    final screenSize = MediaQuery.of(context).size;
    final chartAreaHeight = screenSize.height * 0.6; // 60% of screen for chart
    final headerHeight = 80.0; // Header height
    final bonusBarHeight = 50.0; // Bonus bar height
    final chartPadding = 20.0; // Chart padding
    
    final price = boxInfo['price'] as double;
    
    // Center the box vertically based on price offset from current price
    final chartHeight = chartAreaHeight - headerHeight - bonusBarHeight - (chartPadding * 2);
    final centerY = headerHeight + bonusBarHeight + chartPadding + (chartHeight / 2);
    
    // Calculate Y position based on price difference from current
    double priceRange = 3.0; // Fixed range for our scale (-1.5 to +1.5)
    final priceDiff = price - _currentPrice;
    final normalizedDiff = priceDiff / priceRange;
    final chartY = centerY - (normalizedDiff * chartHeight);
    
    // X position at the right edge (3 seconds ahead)
    final chartX = screenSize.width - chartPadding;
    
    final endPosition = Offset(chartX, chartY);
    
    // Create animated box
    final key = GlobalKey();
    final animatedBox = AnimatedBoxPlacement(
      key: key,
      value: boxInfo['value'],
      color: boxInfo['color'],
      startPosition: startPosition,
      endPosition: endPosition,
      onComplete: () {
        setState(() {
          _animatedBoxPlacements.removeWhere((widget) => widget.key == key);
          // Mark the box as animated so it appears on the chart
          for (var i = 0; i < selectedBoxData.length; i++) {
            if (selectedBoxData[i]['value'] == boxInfo['value'] && 
                selectedBoxData[i]['price'] == boxInfo['price']) {
              selectedBoxData[i]['animated'] = true;
              break;
            }
          }
        });
      },
    );
    
    setState(() {
      _animatedBoxPlacements.add(animatedBox);
    });
  }
  
  void _checkPriceHits() {
    final List<int> toRemove = [];
    
    for (int i = 0; i < selectedBoxData.length; i++) {
      final box = selectedBoxData[i];
      if (box['animated'] == true && box['hit'] != true && box['atCenter'] == true) {
        final boxPrice = box['price'] as double;
        final threshold = 0.3; // Smaller threshold for our scale
        
        // Check if the current price matches the box's price level
        if ((boxPrice - _currentPrice).abs() <= threshold) {
          // Price hit the box!
          box['hit'] = true;
          toRemove.add(i);
          
          // Calculate reward
          final boxValue = double.parse(box['value']);
          final reward = boxValue * 50; // Base reward
          final profit = reward * (1 + _multiplier);
          
          // Update balance and score
          _balance += profit;
          _score += profit * 10;
          
          // Update bonus - 1 point per hit
          _bonusCurrent = (_bonusCurrent + 1).clamp(0, _bonusMax);
          _bonusProgress = _bonusCurrent / _bonusMax;
          
          // Show effects at center of screen
          final screenSize = MediaQuery.of(context).size;
          final centerX = screenSize.width / 2;
          final centerY = screenSize.height * 0.3; // Center of chart area
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
      }
    }
    
    // Remove hit boxes in reverse order to maintain indices
    for (int i = toRemove.length - 1; i >= 0; i--) {
      final index = toRemove[i];
      if (index < selectedIndices.length) {
        final removedIndex = selectedIndices.removeAt(index);
        _animationControllers[removedIndex].reset();
      }
      selectedBoxData.removeAt(index);
    }
  }
  
  void _checkBoxTimeouts() {
    final List<int> toRemove = [];
    final currentTime = DateTime.now().millisecondsSinceEpoch;
    final placeTime = 3000; // 3 seconds to reach center
    final extraTime = 3000; // 3 more seconds after passing center
    
    for (int i = 0; i < selectedBoxData.length; i++) {
      final box = selectedBoxData[i];
      if (box['animated'] == true && box['hit'] != true && box['timestamp'] != null) {
        final boxTime = box['timestamp'] as int;
        final timeDiff = currentTime - boxTime;
        
        // Remove box if it's been more than 6 seconds (3 to center + 3 after)
        if (timeDiff > placeTime + extraTime) {
          toRemove.add(i);
          
          // Show timeout effect at left side of screen
          final screenSize = MediaQuery.of(context).size;
          final centerY = screenSize.height * 0.3;
          final position = Offset(40, centerY);
          
          _showFloatingText('MISSED', position, Colors.orange, fontSize: 14);
        }
      }
    }
    
    // Remove timed out boxes
    for (int i = toRemove.length - 1; i >= 0; i--) {
      final index = toRemove[i];
      if (index < selectedIndices.length) {
        final removedIndex = selectedIndices.removeAt(index);
        _animationControllers[removedIndex].reset();
      }
      selectedBoxData.removeAt(index);
    }
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
    showDialog(
      context: context,
      barrierDismissible: false,
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
  }
  
  void _resetGame() {
    setState(() {
      _gameOver = false;
      _score = 4949.6;
      _balance = _initialBalance;
      _combo = 0;
      _multiplier = 1.0;
      _bonusCurrent = 47;
      _bonusProgress = _bonusCurrent / _bonusMax;
      selectedIndices.clear();
      selectedBoxData.clear();
      _floatingTexts.clear();
      _particles.clear();
      
      // Reset all animations
      for (var controller in _animationControllers) {
        controller.reset();
      }
      
      // Generate new boxes
      boxData = List.generate(63, (index) => generateRandomBox());
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

                // Chart and game area (60%)
                Expanded(
                  flex: 6,
                  child: Stack(
                    children: [
                      // Background effects
                      const ChartBackgroundEffects(),
                      
                      // Smooth line chart background
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: ScrollingChartWidget(
                          priceHistory: _priceHistory,
                          currentPrice: _currentPrice,
                          placedBoxes: selectedBoxData,
                          priceLevels: _priceLevels,
                          selectedPriceLevel: _selectedPriceLevel,
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
                      padding: const EdgeInsets.only(
                        left: 8.0,
                        right: 8.0,
                        top: 8.0,
                        bottom: 8.0, // Add bottom padding to prevent cutoff
                      ),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          const int columns = 9; // 9 columns
                          return GridView.builder(
                            key: gridKey,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: boxData.length,
                            padding: EdgeInsets.zero,
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: columns,
                              crossAxisSpacing: 2,
                              mainAxisSpacing: 2,
                              childAspectRatio: 0.9, // Better fit for 7 rows with padding
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
            // Particle effects
            ..._particles,
            
            // Animated box placements
            ..._animatedBoxPlacements,
            
            // Floating text animations
            ..._floatingTexts,
          ],
        ),
      ),
    );
  }
}
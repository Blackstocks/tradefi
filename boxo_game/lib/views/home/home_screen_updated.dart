import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../widgets/smooth_line_chart_widget.dart';
import '../../widgets/box_3d_widget.dart';
import '../../widgets/bonus_progress_bar.dart';
import '../../widgets/floating_text_animation.dart';
import '../../widgets/particle_explosion.dart';
import '../../widgets/game_result_overlay.dart';
import '../../widgets/animated_box_placement.dart';

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
  final int _maxPriceHistory = 60; // 60 points for smooth line
  
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
    const int count = 54; // 9 columns x 6 rows
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
    
    // Initialize price history
    _priceHistory = List.generate(_maxPriceHistory, (index) => _currentPrice);
    
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
    _priceTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      setState(() {
        // Generate smooth price movement
        final random = Random();
        final change = (random.nextDouble() - 0.5) * 2;
        final volatility = 0.3; // Reduced for smoother movement
        
        _currentPrice = _currentPrice * (1 + change * volatility / 100);
        _currentPrice = _currentPrice.clamp(80.0, 120.0); // Tighter range for better visualization
        
        // Update price history
        _priceHistory.add(_currentPrice);
        if (_priceHistory.length > _maxPriceHistory) {
          _priceHistory.removeAt(0);
        }
        
        // Check win/lose conditions
        _checkGameStatus();
      });
    });
  }

  void _onBoxTapped(int index) {
    if (selectedIndices.contains(index) || _isProcessingMatch || _gameOver) return;

    final selectedBoxInfo = Map<String, dynamic>.from(boxData[index]);
    selectedBoxInfo['price'] = _currentPrice;
    selectedBoxInfo['timestamp'] = DateTime.now().millisecondsSinceEpoch;
    
    final RenderBox? boxRenderBox = boxKeys[index].currentContext?.findRenderObject() as RenderBox?;
    if (boxRenderBox == null) return;

    final boxPosition = boxRenderBox.localToGlobal(Offset.zero);
    final boxSize = boxRenderBox.size;

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
    }

    setState(() {
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
  
  void _animateBoxToChart(Map<String, dynamic> boxInfo, Offset startPosition) {
    // Calculate the end position on the chart
    final screenSize = MediaQuery.of(context).size;
    final chartAreaHeight = screenSize.height * 0.6; // 60% of screen for chart
    final headerHeight = 80.0; // Header height
    final bonusBarHeight = 50.0; // Bonus bar height
    final chartPadding = 20.0; // Chart padding
    
    final price = boxInfo['price'] as double;
    
    // Get price range from current price history
    double minPrice = _priceHistory.reduce((a, b) => a < b ? a : b);
    double maxPrice = _priceHistory.reduce((a, b) => a > b ? a : b);
    double priceRange = maxPrice - minPrice;
    if (priceRange == 0) priceRange = 1;
    
    // Add padding to price range (same as in chart)
    minPrice -= priceRange * 0.1;
    maxPrice += priceRange * 0.1;
    priceRange = maxPrice - minPrice;
    
    // Calculate Y position (inverted because chart draws from bottom)
    final normalizedPrice = (price - minPrice) / priceRange;
    final chartHeight = chartAreaHeight - headerHeight - bonusBarHeight - (chartPadding * 2);
    final chartY = headerHeight + bonusBarHeight + chartPadding + 
                   (chartHeight - (normalizedPrice * chartHeight));
    
    // X position at the right side of chart (with padding)
    final chartWidth = screenSize.width - (chartPadding * 2);
    final chartX = chartPadding + (chartWidth * 0.9); // 90% to the right
    
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
  
  void _checkGameStatus() {
    // Win condition: reach target score
    if (_score >= _targetScore && !_gameOver) {
      setState(() {
        _gameOver = true;
      });
      _showGameResult(true);
    }
    
    // Lose condition: balance below 0
    if (_balance <= 0 && !_gameOver) {
      setState(() {
        _gameOver = true;
      });
      _showGameResult(false);
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
      boxData = List.generate(54, (index) => generateRandomBox());
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
                      // Smooth line chart background
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: SmoothLineChartWidget(
                          priceHistory: _priceHistory,
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
                        bottom: 0, // No bottom padding
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
                              childAspectRatio: 1, // Square boxes
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
            
            // Box price control - transparent, left corner, middle of screen
            Positioned(
              bottom: MediaQuery.of(context).size.height * 0.4 - 20,
              left: 10,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A3E).withOpacity(0.5),
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.1),
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'BOX PRICE',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.5),
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\$${_boxPrice.toStringAsFixed(5)}',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 20),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A2E).withOpacity(0.5),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              setState(() {
                                if (_boxQuantity > 1) _boxQuantity--;
                              });
                            },
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              child: Icon(
                                Icons.remove,
                                color: Colors.white.withOpacity(0.5),
                                size: 18,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Text(
                              _boxQuantity.toString(),
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              setState(() {
                                _boxQuantity++;
                              });
                            },
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              child: Icon(
                                Icons.add,
                                color: Colors.white.withOpacity(0.5),
                                size: 18,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
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
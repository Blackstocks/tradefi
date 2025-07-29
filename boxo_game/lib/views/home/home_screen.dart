import 'dart:math';
import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

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

  // Generate a single random box
  Map<String, dynamic> generateRandomBox() {
    final random = Random();
    List<Color> colors = [
      Colors.blue.shade600,
      Colors.green.shade600,
      Colors.orange.shade600,
    ];
    return {
      'value': (random.nextDouble() * 5).toStringAsFixed(1),
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
    
    final random = Random();
    List<Color> colors = [
      Colors.blue.shade600,
      Colors.green.shade600,
      Colors.orange.shade600,
    ];
    boxData = List.generate(count, (index) {
      return {
        'value': (random.nextDouble() * 5).toStringAsFixed(1),
        'color': colors[random.nextInt(colors.length)],
      };
    });
  }

  @override
  void dispose() {
    for (var controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _onBoxTapped(int index) {
    if (selectedIndices.contains(index)) return;

    final selectedBoxInfo = Map<String, dynamic>.from(boxData[index]);
    final RenderBox? boxRenderBox = boxKeys[index].currentContext?.findRenderObject() as RenderBox?;
    if (boxRenderBox == null) return;

    final boxPosition = boxRenderBox.localToGlobal(Offset.zero);
    final boxSize = boxRenderBox.size;
    final screenSize = MediaQuery.of(context).size;
    final topAreaHeight = screenSize.height * 0.6;
    final targetX = (screenSize.width - boxSize.width) / 2;

    setState(() {
      // Remove oldest if already at max
      if (selectedIndices.length >= maxCenterBoxes) {
        final removedIndex = selectedIndices.removeAt(0);
        selectedBoxData.removeAt(0);
        _animationControllers[removedIndex].reset();
      }

      selectedIndices.add(index);
      selectedBoxData.add(selectedBoxInfo);

      // Replace tapped grid box with new one
      boxData[index] = generateRandomBox();
    });

    final stackPosition = selectedIndices.length - 1;
    const gap = 8.0;
    final totalHeight = (boxSize.height + gap) * selectedIndices.length - gap;
    final startY = (topAreaHeight - totalHeight) / 2 + MediaQuery.of(context).padding.top;
    final targetY = startY + (boxSize.height + gap) * stackPosition;

    final deltaX = targetX - boxPosition.dx;
    final deltaY = targetY - boxPosition.dy;

    _positionAnimations[index] = Tween<Offset>(
      begin: Offset.zero,
      end: Offset(deltaX, deltaY),
    ).animate(CurvedAnimation(
      parent: _animationControllers[index],
      curve: Curves.easeInOutCubic,
    ));

    _animationControllers[index].forward(from: 0);

    // No need for extra setState here, as above covers it
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
          Widget boxWidget = Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: item['color'],
              borderRadius: BorderRadius.circular(isSelected ? 8 : 3),
              boxShadow: isSelected ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 15,
                  spreadRadius: 3,
                  offset: const Offset(0, 8),
                ),
              ] : null,
            ),
            child: Text(
              item['value'],
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 16,
                fontFeatures: [FontFeature.tabularFigures()],
              ),
            ),
          );

          if (isSelected) {
            final selectedIndex = selectedIndices.indexOf(index);
            if (selectedIndex != -1 && selectedIndex < selectedBoxData.length) {
              final selectedData = selectedBoxData[selectedIndex];
              return Transform.translate(
                offset: _positionAnimations[index].value,
                child: Container(
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: selectedData['color'],
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        blurRadius: 15,
                        spreadRadius: 3,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Text(
                    selectedData['value'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                  ),
                ),
              );
            }
          }
          
          return boxWidget;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        children: const [
                          Icon(CupertinoIcons.person, color: Colors.white),
                          SizedBox(height: 4),
                          Text('ACCOUNT', style: TextStyle(color: Colors.white, fontSize: 12)),
                        ],
                      ),
                      Column(
                        children: const [
                          Text('4 937,1',
                              style: TextStyle(
                                color: CupertinoColors.activeGreen,
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                              )),
                          SizedBox(height: 4),
                          Text('SCORE', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                      Column(
                        children: const [
                          Text('9 465,0',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 17,
                                fontWeight: FontWeight.w600,
                              )),
                          SizedBox(height: 4),
                          Text('BALANCE', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),

                // Empty top space (60%)
                const Expanded(flex: 6, child: SizedBox()),

                // Grid (40%)
                Expanded(
                  flex: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
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
                            crossAxisSpacing: 2,
                            mainAxisSpacing: 2,
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
              ],
            ),
            
            // Reset button for testing (optional)
            if (selectedIndices.isNotEmpty)
              Positioned(
                top: 50,
                right: 20,
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      for (int i = 0; i < _animationControllers.length; i++) {
                        _animationControllers[i].reset();
                      }
                      selectedIndices.clear();
                      selectedBoxData.clear();
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: const Text(
                      'RESET',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

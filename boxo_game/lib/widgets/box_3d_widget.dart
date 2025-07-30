import 'package:flutter/material.dart';

class Box3DWidget extends StatelessWidget {
  final String value;
  final Color color;
  final double width;
  final double height;
  final VoidCallback? onTap;
  final bool isSelected;

  const Box3DWidget({
    super.key,
    required this.value,
    required this.color,
    this.width = 60,
    this.height = 60,
    this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        child: Stack(
          children: [
            // Shadow
            Positioned(
              top: 4,
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            // Main box
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              bottom: 4,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      color.withOpacity(0.9),
                      color,
                      color.withOpacity(0.7),
                    ],
                    stops: const [0.0, 0.5, 1.0],
                  ),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: color.withOpacity(0.8),
                    width: 1,
                  ),
                ),
                child: Stack(
                  children: [
                    // Inner highlight
                    Positioned(
                      top: 2,
                      left: 2,
                      right: 2,
                      height: 15,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.white.withOpacity(0.3),
                              Colors.transparent,
                            ],
                          ),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(6),
                            topRight: Radius.circular(6),
                          ),
                        ),
                      ),
                    ),
                    // Value text
                    Center(
                      child: Text(
                        value,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: width * 0.3,
                          fontWeight: FontWeight.bold,
                          shadows: [
                            Shadow(
                              offset: const Offset(0, 1),
                              blurRadius: 2,
                              color: Colors.black.withOpacity(0.5),
                            ),
                          ],
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
    );
  }
}

// Box colors based on the reference image
class BoxColors {
  static Color green = const Color(0xFF4CAF50);
  static Color purple = const Color(0xFF9C27B0);
  static Color pink = const Color(0xFFE91E63);
  static Color orange = const Color(0xFFFF9800);
  static Color blue = const Color(0xFF2196F3);
  static Color grey = const Color(0xFF757575);
}
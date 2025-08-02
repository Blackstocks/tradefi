import 'package:flutter/material.dart';

class AnimatedBox3DWidget extends StatefulWidget {
  final String value;
  final Color color;
  final double width;
  final double height;
  final VoidCallback? onTap;
  final bool isSelected;

  const AnimatedBox3DWidget({
    super.key,
    required this.value,
    required this.color,
    this.width = 60,
    this.height = 60,
    this.onTap,
    this.isSelected = false,
  });

  @override
  State<AnimatedBox3DWidget> createState() => _AnimatedBox3DWidgetState();
}

class _AnimatedBox3DWidgetState extends State<AnimatedBox3DWidget>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _rippleController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rippleAnimation;
  late Animation<double> _rippleOpacityAnimation;

  @override
  void initState() {
    super.initState();

    // Scale animation controller
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );

    // Ripple animation controller
    _rippleController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    // Scale animation - bouncy effect
    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 0.85)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.85, end: 1.1)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.1, end: 1.0)
            .chain(CurveTween(curve: Curves.elasticOut)),
        weight: 20,
      ),
    ]).animate(_scaleController);

    // Ripple animations
    _rippleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.5,
    ).animate(CurvedAnimation(
      parent: _rippleController,
      curve: Curves.easeOut,
    ));

    _rippleOpacityAnimation = Tween<double>(
      begin: 0.5,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _rippleController,
      curve: Curves.easeOut,
    ));
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _rippleController.dispose();
    super.dispose();
  }

  void _handleTap() {
    if (widget.onTap != null) {
      // Start animations
      _scaleController.forward().then((_) {
        _scaleController.reverse();
      });
      
      _rippleController.forward().then((_) {
        _rippleController.reset();
      });

      // Call the onTap callback
      widget.onTap!();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        _scaleController.forward();
      },
      onTapUp: (_) {
        _scaleController.reverse();
      },
      onTapCancel: () {
        _scaleController.reverse();
      },
      onTap: _handleTap,
      child: AnimatedBuilder(
        animation: Listenable.merge([_scaleController, _rippleController]),
        builder: (context, child) {
          return Container(
            width: widget.width,
            height: widget.height,
            child: Stack(
              children: [
                // Ripple effect
                if (_rippleController.isAnimating)
                  Positioned.fill(
                    child: Center(
                      child: Transform.scale(
                        scale: _rippleAnimation.value,
                        child: Container(
                          width: widget.width,
                          height: widget.height,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: widget.color.withOpacity(_rippleOpacityAnimation.value),
                          ),
                        ),
                      ),
                    ),
                  ),

                // Scaled box
                Transform.scale(
                  scale: _scaleAnimation.value,
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
                      // Main box with glow effect when tapped
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
                                widget.color.withOpacity(0.9),
                                widget.color,
                                widget.color.withOpacity(0.7),
                              ],
                              stops: const [0.0, 0.5, 1.0],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: widget.color.withOpacity(0.8),
                              width: 1,
                            ),
                            boxShadow: _scaleController.isAnimating
                                ? [
                                    BoxShadow(
                                      color: widget.color.withOpacity(0.6),
                                      blurRadius: 20,
                                      spreadRadius: 2,
                                    ),
                                  ]
                                : [],
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
                              // Value text with slight rotation when tapped
                              Center(
                                child: Transform.rotate(
                                  angle: _scaleController.isAnimating
                                      ? (1 - _scaleAnimation.value) * 0.1
                                      : 0,
                                  child: Text(
                                    widget.value,
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: widget.width * 0.3,
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
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
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
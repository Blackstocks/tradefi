import 'package:flutter/material.dart';

class FloatingTextAnimation extends StatefulWidget {
  final String text;
  final Offset startPosition;
  final Color color;
  final double? fontSize;
  final VoidCallback? onComplete;

  const FloatingTextAnimation({
    super.key,
    required this.text,
    required this.startPosition,
    this.color = Colors.yellowAccent,
    this.fontSize,
    this.onComplete,
  });

  @override
  State<FloatingTextAnimation> createState() => _FloatingTextAnimationState();
}

class _FloatingTextAnimationState extends State<FloatingTextAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 1.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
    ));

    _slideAnimation = Tween<Offset>(
      begin: Offset.zero,
      end: const Offset(0, -100),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));

    _controller.forward().then((_) {
      widget.onComplete?.call();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Positioned(
          left: widget.startPosition.dx,
          top: widget.startPosition.dy + _slideAnimation.value.dy,
          child: Opacity(
            opacity: _fadeAnimation.value,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: widget.color, width: 2),
              ),
              child: Text(
                widget.text,
                style: TextStyle(
                  color: widget.color,
                  fontSize: widget.fontSize ?? 24,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      offset: const Offset(0, 2),
                      blurRadius: 4,
                      color: Colors.black.withOpacity(0.8),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
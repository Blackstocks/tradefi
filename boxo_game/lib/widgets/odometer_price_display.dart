import 'dart:math';
import 'package:flutter/material.dart';

class OdometerPriceDisplay extends StatefulWidget {
  final double price;
  final TextStyle? textStyle;
  
  const OdometerPriceDisplay({
    Key? key,
    required this.price,
    this.textStyle,
  }) : super(key: key);

  @override
  State<OdometerPriceDisplay> createState() => _OdometerPriceDisplayState();
}

class _OdometerPriceDisplayState extends State<OdometerPriceDisplay> 
    with TickerProviderStateMixin {
  late String _currentPriceString;
  late String _previousPriceString;
  Map<int, AnimationController> _digitControllers = {};
  Map<int, Animation<double>> _digitAnimations = {};
  
  @override
  void initState() {
    super.initState();
    _currentPriceString = _formatPrice(widget.price);
    _previousPriceString = _currentPriceString;
    _initializeAnimations();
  }
  
  @override
  void didUpdateWidget(OdometerPriceDisplay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.price != widget.price) {
      _animateToNewPrice();
    }
  }
  
  void _initializeAnimations() {
    for (int i = 0; i < _currentPriceString.length; i++) {
      // Create animation for all characters including decimal point
      _digitControllers[i] = AnimationController(
        duration: const Duration(milliseconds: 400),
        vsync: this,
      );
      _digitAnimations[i] = CurvedAnimation(
        parent: _digitControllers[i]!,
        curve: Curves.easeInOutCubic,
      );
    }
  }
  
  void _animateToNewPrice() {
    _previousPriceString = _currentPriceString;
    _currentPriceString = _formatPrice(widget.price);
    
    // Ensure both strings have same length
    int maxLength = max(_previousPriceString.length, _currentPriceString.length);
    _previousPriceString = _previousPriceString.padLeft(maxLength, ' ');
    _currentPriceString = _currentPriceString.padLeft(maxLength, ' ');
    
    // Animate changed characters (including decimal point)
    for (int i = 0; i < _currentPriceString.length; i++) {
      if (_previousPriceString[i] != _currentPriceString[i]) {
        _digitControllers[i]?.forward(from: 0);
      }
    }
  }
  
  String _formatPrice(double price) {
    if (price >= 10000) {
      // For very large prices (like BTC), show 2 decimals without comma
      return '\$${price.toStringAsFixed(2)}';
    } else if (price >= 100) {
      // For medium prices, show 2 decimals
      return '\$${price.toStringAsFixed(2)}';
    } else if (price >= 1) {
      // For smaller prices, show 3 decimals
      return '\$${price.toStringAsFixed(3)}';
    } else {
      // For very small prices (< $1), show 4 decimals
      return '\$${price.toStringAsFixed(4)}';
    }
  }
  
  @override
  void dispose() {
    for (var controller in _digitControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    final defaultStyle = widget.textStyle ?? const TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: Colors.cyanAccent,
      fontFamily: 'monospace',
    );
    
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(_currentPriceString.length, (index) {
        final char = _currentPriceString[index];
        final prevChar = index < _previousPriceString.length 
            ? _previousPriceString[index] 
            : ' ';
        
        return AnimatedBuilder(
          animation: _digitAnimations[index] ?? 
              const AlwaysStoppedAnimation(0.0),
          builder: (context, child) {
            final animation = _digitAnimations[index]?.value ?? 0.0;
            
            return Container(
              width: defaultStyle.fontSize! * 0.6,
              height: defaultStyle.fontSize! * 1.5,
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  // Main digit with simplified animation
                  AnimatedBuilder(
                    animation: _digitAnimations[index] ?? const AlwaysStoppedAnimation(0.0),
                    builder: (context, _) {
                      final progress = _digitAnimations[index]?.value ?? 0.0;
                      
                      if (progress == 0) {
                        // No animation, just show current digit
                        return Text(
                          char,
                          style: defaultStyle,
                          textAlign: TextAlign.center,
                        );
                      }
                      
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          // Previous digit sliding up and fading out
                          Transform.translate(
                            offset: Offset(0, -progress * 15),
                            child: Opacity(
                              opacity: 1 - progress,
                              child: Text(
                                prevChar,
                                style: defaultStyle,
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                          
                          // Current digit sliding up and fading in
                          Transform.translate(
                            offset: Offset(0, (1 - progress) * 15),
                            child: Opacity(
                              opacity: progress,
                              child: Text(
                                char,
                                style: defaultStyle,
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                  
                  // Highlight glow effect
                  if (animation > 0 && animation < 1)
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: RadialGradient(
                            colors: [
                              defaultStyle.color!.withOpacity(0.3 * animation),
                              Colors.transparent,
                            ],
                            radius: 1.5,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      }),
    );
  }
}
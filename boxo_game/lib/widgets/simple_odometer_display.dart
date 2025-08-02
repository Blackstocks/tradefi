import 'dart:math';
import 'package:flutter/material.dart';

class SimpleOdometerDisplay extends StatefulWidget {
  final double value;
  final TextStyle? textStyle;
  final int decimalPlaces;
  final String? prefix;
  
  const SimpleOdometerDisplay({
    Key? key,
    required this.value,
    this.textStyle,
    this.decimalPlaces = 1,
    this.prefix,
  }) : super(key: key);

  @override
  State<SimpleOdometerDisplay> createState() => _SimpleOdometerDisplayState();
}

class _SimpleOdometerDisplayState extends State<SimpleOdometerDisplay> 
    with TickerProviderStateMixin {
  late String _currentValueString;
  late String _previousValueString;
  Map<int, AnimationController> _digitControllers = {};
  Map<int, Animation<double>> _digitAnimations = {};
  
  @override
  void initState() {
    super.initState();
    _currentValueString = _formatValue(widget.value);
    _previousValueString = _currentValueString;
    _initializeAnimations();
  }
  
  @override
  void didUpdateWidget(SimpleOdometerDisplay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _animateToNewValue();
    }
  }
  
  void _initializeAnimations() {
    // Clear old controllers
    for (var controller in _digitControllers.values) {
      controller.dispose();
    }
    _digitControllers.clear();
    _digitAnimations.clear();
    
    for (int i = 0; i < _currentValueString.length; i++) {
      _digitControllers[i] = AnimationController(
        duration: const Duration(milliseconds: 500),
        vsync: this,
      );
      _digitAnimations[i] = CurvedAnimation(
        parent: _digitControllers[i]!,
        curve: Curves.easeInOutCubic,
      );
    }
  }
  
  void _animateToNewValue() {
    _previousValueString = _currentValueString;
    _currentValueString = _formatValue(widget.value);
    
    // Ensure both strings have same length
    int maxLength = max(_previousValueString.length, _currentValueString.length);
    _previousValueString = _previousValueString.padLeft(maxLength, ' ');
    _currentValueString = _currentValueString.padLeft(maxLength, ' ');
    
    // Re-initialize animations if length changed
    if (_currentValueString.length != _digitControllers.length) {
      _initializeAnimations();
    }
    
    // Animate changed characters
    for (int i = 0; i < _currentValueString.length; i++) {
      if (i < _previousValueString.length && _previousValueString[i] != _currentValueString[i]) {
        _digitControllers[i]?.forward(from: 0);
      }
    }
  }
  
  String _formatValue(double value) {
    final prefix = widget.prefix ?? '';
    // Show value without decimal if it's a whole number
    if (value % 1 == 0) {
      return '$prefix${value.toInt()}';
    }
    return '$prefix${value.toStringAsFixed(widget.decimalPlaces)}';
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
      fontSize: 16,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    );
    
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(_currentValueString.length, (index) {
        final char = _currentValueString[index];
        final prevChar = index < _previousValueString.length 
            ? _previousValueString[index] 
            : ' ';
        
        return AnimatedBuilder(
          animation: _digitAnimations[index] ?? 
              const AlwaysStoppedAnimation(0.0),
          builder: (context, child) {
            final animation = _digitAnimations[index]?.value ?? 0.0;
            
            return Container(
              width: char == '.' ? defaultStyle.fontSize! * 0.3 : defaultStyle.fontSize! * 0.6,
              height: defaultStyle.fontSize! * 1.3,
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  if (animation == 0)
                    Text(
                      char,
                      style: defaultStyle,
                      textAlign: TextAlign.center,
                    )
                  else
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        // Previous character sliding up and fading out
                        Transform.translate(
                          offset: Offset(0, -animation * 12),
                          child: Opacity(
                            opacity: 1 - animation,
                            child: Text(
                              prevChar,
                              style: defaultStyle,
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                        
                        // Current character sliding up and fading in
                        Transform.translate(
                          offset: Offset(0, (1 - animation) * 12),
                          child: Opacity(
                            opacity: animation,
                            child: Text(
                              char,
                              style: defaultStyle,
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                      ],
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
import 'dart:math';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class ScrollingChartWidget extends StatelessWidget {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;
  final List<double> priceLevels;
  final int selectedPriceLevel;
  final double chartTopOffset;

  const ScrollingChartWidget({
    super.key,
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
    this.priceLevels = const [],
    this.selectedPriceLevel = 2,
    this.chartTopOffset = 0.0,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: ScrollingChartPainter(
        priceHistory: priceHistory,
        currentPrice: currentPrice,
        placedBoxes: placedBoxes,
        priceLevels: priceLevels,
        selectedPriceLevel: selectedPriceLevel,
        chartTopOffset: chartTopOffset,
      ),
      child: Container(),
    );
  }
}

class ScrollingChartPainter extends CustomPainter {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;
  final List<double> priceLevels;
  final int selectedPriceLevel;
  final double chartTopOffset;

  ScrollingChartPainter({
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
    required this.priceLevels,
    required this.selectedPriceLevel,
    required this.chartTopOffset,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (priceHistory.isEmpty) return;

    final centerX = size.width / 2;
    final centerY = size.height / 2;
    
    // Draw gradient background
    final backgroundPaint = Paint()
      ..shader = ui.Gradient.radial(
        Offset(centerX, centerY),
        size.width * 0.8,
        [
          Colors.cyanAccent.withOpacity(0.05),
          Colors.transparent,
        ],
        [0.0, 1.0],
      );
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), backgroundPaint);
    
    // Draw subtle glow effects
    for (int i = 0; i < 3; i++) {
      final glowPaint = Paint()
        ..color = Colors.cyanAccent.withOpacity(0.02 - (i * 0.005))
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 50 + (i * 30).toDouble());
      
      canvas.drawCircle(Offset(centerX, centerY), 100 + (i * 50).toDouble(), glowPaint);
    }
    
    // Add subtle scanlines effect
    final scanlinePaint = Paint()
      ..shader = ui.Gradient.linear(
        const Offset(0, 0),
        Offset(0, size.height),
        [
          Colors.transparent,
          Colors.white.withOpacity(0.02),
          Colors.transparent,
          Colors.white.withOpacity(0.01),
          Colors.transparent,
        ],
        [0.0, 0.3, 0.5, 0.7, 1.0],
      );
    
    for (int i = 0; i < size.height.toInt(); i += 4) {
      canvas.drawLine(
        Offset(0, i.toDouble()),
        Offset(size.width, i.toDouble()),
        scanlinePaint,
      );
    }

    // Calculate price range for scaling
    double minPrice = priceHistory.reduce(min);
    double maxPrice = priceHistory.reduce(max);
    
    // Add price levels to range calculation
    if (priceLevels.isNotEmpty) {
      minPrice = min(minPrice, priceLevels.reduce(min));
      maxPrice = max(maxPrice, priceLevels.reduce(max));
    }
    
    double priceRange = maxPrice - minPrice;
    if (priceRange < 3) priceRange = 3; // Minimum range for our scale

    // Add padding
    minPrice -= priceRange * 0.2;
    maxPrice += priceRange * 0.2;
    priceRange = maxPrice - minPrice;

    // Calculate vertical offset to keep current price at center
    final currentPriceY = centerY;
    final priceToY = (double price) {
      final normalized = (price - currentPrice) / priceRange;
      // Use full height for maximum visual impact
      return centerY - (normalized * size.height * 0.85);
    };

    // Clean background - no grid lines or labels

    // Draw price line (shifted by current price to keep it centered)
    final path = Path();
    
    // First draw a glow trail
    final glowPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.3)
      ..strokeWidth = 8.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    
    final linePaint = Paint()
      ..color = Colors.cyanAccent
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square; // Square cap for sharper edges
    
    // Draw line from left to center with square wave pattern
    for (int i = 0; i < priceHistory.length; i++) {
      final x = centerX * i / (priceHistory.length - 1);
      final y = priceToY(priceHistory[i]);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        final prevX = centerX * (i - 1) / (priceHistory.length - 1);
        final prevY = priceToY(priceHistory[i - 1]);
        
        // Square wave: horizontal line then vertical line
        path.lineTo(x, prevY); // Horizontal line at previous price
        path.lineTo(x, y);     // Vertical line to new price
      }
    }
    
    // Draw glow trail first
    canvas.drawPath(path, glowPaint);
    
    // Then draw the main line
    canvas.drawPath(path, linePaint);

    // Draw 4-direction pointer/crosshair at center
    final pointerPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.6)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    final pointerGlowPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.3)
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    
    // Pointer length
    const pointerLength = 20.0;
    const gap = 10.0; // Gap from center
    
    // Draw crosshair lines with glow
    // Top line
    canvas.drawLine(
      Offset(centerX, centerY - gap - pointerLength),
      Offset(centerX, centerY - gap),
      pointerGlowPaint,
    );
    canvas.drawLine(
      Offset(centerX, centerY - gap - pointerLength),
      Offset(centerX, centerY - gap),
      pointerPaint,
    );
    
    // Bottom line
    canvas.drawLine(
      Offset(centerX, centerY + gap),
      Offset(centerX, centerY + gap + pointerLength),
      pointerGlowPaint,
    );
    canvas.drawLine(
      Offset(centerX, centerY + gap),
      Offset(centerX, centerY + gap + pointerLength),
      pointerPaint,
    );
    
    // Left line
    canvas.drawLine(
      Offset(centerX - gap - pointerLength, centerY),
      Offset(centerX - gap, centerY),
      pointerGlowPaint,
    );
    canvas.drawLine(
      Offset(centerX - gap - pointerLength, centerY),
      Offset(centerX - gap, centerY),
      pointerPaint,
    );
    
    // Right line
    canvas.drawLine(
      Offset(centerX + gap, centerY),
      Offset(centerX + gap + pointerLength, centerY),
      pointerGlowPaint,
    );
    canvas.drawLine(
      Offset(centerX + gap, centerY),
      Offset(centerX + gap + pointerLength, centerY),
      pointerPaint,
    );
    
    // Draw corner brackets for style
    const bracketSize = 8.0;
    final bracketPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.4)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    
    // Top-left bracket
    final tlPath = Path()
      ..moveTo(centerX - gap - pointerLength, centerY - gap - pointerLength + bracketSize)
      ..lineTo(centerX - gap - pointerLength, centerY - gap - pointerLength)
      ..lineTo(centerX - gap - pointerLength + bracketSize, centerY - gap - pointerLength);
    canvas.drawPath(tlPath, bracketPaint);
    
    // Top-right bracket
    final trPath = Path()
      ..moveTo(centerX + gap + pointerLength - bracketSize, centerY - gap - pointerLength)
      ..lineTo(centerX + gap + pointerLength, centerY - gap - pointerLength)
      ..lineTo(centerX + gap + pointerLength, centerY - gap - pointerLength + bracketSize);
    canvas.drawPath(trPath, bracketPaint);
    
    // Bottom-left bracket
    final blPath = Path()
      ..moveTo(centerX - gap - pointerLength, centerY + gap + pointerLength - bracketSize)
      ..lineTo(centerX - gap - pointerLength, centerY + gap + pointerLength)
      ..lineTo(centerX - gap - pointerLength + bracketSize, centerY + gap + pointerLength);
    canvas.drawPath(blPath, bracketPaint);
    
    // Bottom-right bracket
    final brPath = Path()
      ..moveTo(centerX + gap + pointerLength - bracketSize, centerY + gap + pointerLength)
      ..lineTo(centerX + gap + pointerLength, centerY + gap + pointerLength)
      ..lineTo(centerX + gap + pointerLength, centerY + gap + pointerLength - bracketSize);
    canvas.drawPath(brPath, bracketPaint);

    // Draw glowing dot at center (fixed position)
    // Outer glow
    for (int i = 3; i > 0; i--) {
      final glowPaint = Paint()
        ..color = Colors.cyanAccent.withOpacity(0.2 / i)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(centerX, centerY), 8.0 * i, glowPaint);
    }
    
    // Inner dot
    final dotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(centerX, centerY), 6, dotPaint);
    
    final dotBorderPaint = Paint()
      ..color = Colors.cyanAccent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawCircle(Offset(centerX, centerY), 6, dotBorderPaint);

    // Draw placed boxes
    final currentTime = DateTime.now().millisecondsSinceEpoch;
    
    for (var box in placedBoxes) {
      if (box['animated'] == true && box['timestamp'] != null) {
        final boxTime = box['timestamp'] as int;
        final screenY = box['screenY'] as double? ?? centerY;
        
        // Calculate time since placement
        final timeDiff = currentTime - boxTime;
        final secondsSincePlacement = timeDiff / 1000.0;
        
        // Box starts at right edge and moves left with time
        // Chart scrolls at about 60 pixels per second (slower for better gameplay)
        final scrollSpeed = 60.0; // pixels per second
        final startX = size.width - 10; // Start just inside the right edge
        final x = startX - (secondsSincePlacement * scrollSpeed);
        
        // Use the relative Y position directly
        final y = screenY;
        
        // Only process boxes that are still visible on screen
        if (x > -50 && x < size.width) { // Box is on screen
          
          // Check for hit when box passes through the center (where price line is)
          // The price line is always at centerX
          final distanceFromCenter = (x - centerX).abs();
          
          // Check for hit when passing through center
          if (distanceFromCenter < 20 && box['checked'] != true && x > centerX - 20) {
            box['checked'] = true;
            
            // Check if the price line height matches the box position at this moment
            final priceLineY = priceToY(currentPrice); // Get current price line Y position
            final verticalDistance = (y - priceLineY).abs();
            final threshold = 20.0; // Vertical tolerance in pixels
            
            if (verticalDistance <= threshold) {
              box['hit'] = true;
              box['atCenter'] = true; // Trigger reward in checkPriceHits
            }
            // Don't mark as missed here - wait until it reaches the left edge
          }
          
          // Check for miss only when box reaches the left edge
          if (x < 50 && box['hit'] != true && box['missed'] != true) {
            box['missed'] = true;
          }
          
          // Only draw if box is within vertical bounds
          if (y >= 0 && y <= size.height) {
            // Draw box
            final boxPaint = Paint()
              ..color = (box['color'] as Color).withOpacity((box['missed'] ?? false) == true ? 0.3 : 0.9)
              ..style = PaintingStyle.fill;
            
            final rect = RRect.fromRectAndRadius(
              Rect.fromCenter(center: Offset(x, y), width: 50, height: 40),
              const Radius.circular(8),
            );
            
            // Shadow
            final shadowPaint = Paint()
              ..color = Colors.black.withOpacity(0.3)
              ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
            canvas.drawRRect(
              RRect.fromRectAndRadius(
                Rect.fromCenter(center: Offset(x + 2, y + 2), width: 50, height: 40),
                const Radius.circular(8),
              ),
              shadowPaint,
            );
            
            canvas.drawRRect(rect, boxPaint);
            
            // Draw border for hit/miss feedback
            if ((box['hit'] ?? false) == true) {
              final hitBorderPaint = Paint()
                ..color = Colors.greenAccent
                ..style = PaintingStyle.stroke
                ..strokeWidth = 3;
              canvas.drawRRect(rect, hitBorderPaint);
              
              // Draw checkmark for hit
              final checkPaint = Paint()
                ..color = Colors.greenAccent
                ..strokeWidth = 3
                ..style = PaintingStyle.stroke;
              final path = Path();
              path.moveTo(x - 12, y);
              path.lineTo(x - 4, y + 8);
              path.lineTo(x + 12, y - 8);
              canvas.drawPath(path, checkPaint);
            } else if ((box['missed'] ?? false) == true) {
              final missBorderPaint = Paint()
                ..color = Colors.redAccent.withOpacity(0.8)
                ..style = PaintingStyle.stroke
                ..strokeWidth = 2;
              canvas.drawRRect(rect, missBorderPaint);
              
              // Draw X for missed box
              final xPaint = Paint()
                ..color = Colors.redAccent
                ..strokeWidth = 3
                ..style = PaintingStyle.stroke;
              canvas.drawLine(Offset(x - 12, y - 10), Offset(x + 12, y + 10), xPaint);
              canvas.drawLine(Offset(x - 12, y + 10), Offset(x + 12, y - 10), xPaint);
            }
            
            // Draw value
            final textPainter = TextPainter(
              text: TextSpan(
                text: box['value'] as String,
                style: TextStyle(
                  color: (box['missed'] ?? false) == true ? Colors.white.withOpacity(0.5) : Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              textDirection: TextDirection.ltr,
            );
            textPainter.layout();
            textPainter.paint(
              canvas,
              Offset(x - textPainter.width / 2, y - textPainter.height / 2),
            );
          }
        } else if (x < -50) {
          // Box has scrolled off the left side - mark for removal
          box['offScreen'] = true;
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
import 'dart:math';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class SmoothLineChartWidget extends StatelessWidget {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;
  final List<double> priceLevels;
  final int selectedPriceLevel;

  const SmoothLineChartWidget({
    super.key,
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
    this.priceLevels = const [],
    this.selectedPriceLevel = 2,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: SmoothLineChartPainter(
        priceHistory: priceHistory,
        currentPrice: currentPrice,
        placedBoxes: placedBoxes,
        priceLevels: priceLevels,
        selectedPriceLevel: selectedPriceLevel,
      ),
      child: Container(),
    );
  }
}

class SmoothLineChartPainter extends CustomPainter {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;
  final List<double> priceLevels;
  final int selectedPriceLevel;

  SmoothLineChartPainter({
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
    required this.priceLevels,
    required this.selectedPriceLevel,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (priceHistory.isEmpty) return;

    // Find min and max prices for scaling
    double minPrice = priceHistory.reduce(min);
    double maxPrice = priceHistory.reduce(max);
    double priceRange = maxPrice - minPrice;
    if (priceRange == 0) priceRange = 1;

    // Add padding to price range
    minPrice -= priceRange * 0.1;
    maxPrice += priceRange * 0.1;
    priceRange = maxPrice - minPrice;

    // Draw price level lines
    if (priceLevels.isNotEmpty) {
      for (int i = 0; i < priceLevels.length; i++) {
        final levelPrice = priceLevels[i];
        if (levelPrice >= minPrice && levelPrice <= maxPrice) {
          final y = size.height - ((levelPrice - minPrice) / priceRange * size.height);
          
          final levelPaint = Paint()
            ..color = i == selectedPriceLevel 
              ? Colors.cyanAccent.withOpacity(0.3)
              : Colors.white.withOpacity(0.1)
            ..strokeWidth = i == selectedPriceLevel ? 2 : 1;
          
          // Dashed line
          for (double x = 0; x < size.width; x += 10) {
            canvas.drawLine(
              Offset(x, y),
              Offset(min(x + 5, size.width), y),
              levelPaint,
            );
          }
        }
      }
    }

    // Draw smooth price line with gradient
    final linePaint = Paint()
      ..color = Colors.cyanAccent
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Create gradient effect for the line
    final gradient = ui.Gradient.linear(
      Offset(0, 0),
      Offset(size.width, 0),
      [
        Colors.cyanAccent.withOpacity(0.3),
        Colors.cyanAccent.withOpacity(0.6),
        Colors.cyanAccent,
      ],
      [0.0, 0.7, 1.0],
    );
    linePaint.shader = gradient;

    // Center the line chart
    final double chartPadding = size.width * 0.1;
    final double chartWidth = size.width - (chartPadding * 2);
    
    final path = Path();
    for (int i = 0; i < priceHistory.length; i++) {
      final x = chartPadding + (chartWidth * i / (priceHistory.length - 1));
      final y = size.height - ((priceHistory[i] - minPrice) / priceRange * size.height);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        // Create smooth curves between points
        final prevX = chartPadding + (chartWidth * (i - 1) / (priceHistory.length - 1));
        final prevY = size.height - ((priceHistory[i - 1] - minPrice) / priceRange * size.height);
        
        final cp1x = prevX + (x - prevX) / 2;
        final cp1y = prevY;
        final cp2x = prevX + (x - prevX) / 2;
        final cp2y = y;
        
        path.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }
    }
    canvas.drawPath(path, linePaint);

    // Draw glowing area under the line
    final fillPath = Path.from(path);
    fillPath.lineTo(chartPadding + chartWidth, size.height);
    fillPath.lineTo(chartPadding, size.height);
    fillPath.close();
    
    final fillPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(0, 0),
        Offset(0, size.height),
        [
          Colors.cyanAccent.withOpacity(0.3),
          Colors.transparent,
        ],
        [0.0, 1.0],
      );
    canvas.drawPath(fillPath, fillPaint);

    // Draw glowing dot at current price
    final currentX = chartPadding + chartWidth;
    final currentY = size.height - ((currentPrice - minPrice) / priceRange * size.height);
    
    // Outer glow
    for (int i = 3; i > 0; i--) {
      final glowPaint = Paint()
        ..color = Colors.cyanAccent.withOpacity(0.2 / i)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset(currentX, currentY), 6.0 * i, glowPaint);
    }
    
    // Inner dot
    final dotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(currentX, currentY), 5, dotPaint);
    
    final dotBorderPaint = Paint()
      ..color = Colors.cyanAccent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawCircle(Offset(currentX, currentY), 5, dotBorderPaint);


    // Draw placed boxes on the chart
    for (var box in placedBoxes) {
      if (box['timestamp'] != null && box['price'] != null && (box['animated'] ?? false) && box['hit'] != true) {
        final boxTime = box['timestamp'] as int;
        final boxPrice = box['price'] as double;
        final currentTime = DateTime.now().millisecondsSinceEpoch;
        final timeRange = 30000; // 30 seconds timeout
        
        // Calculate x position based on time
        final timeDiff = currentTime - boxTime;
        if (timeDiff <= timeRange) {
          // Keep box at fixed x position (right side of chart)
          final x = chartPadding + chartWidth - 50;
          final y = size.height - ((boxPrice - minPrice) / priceRange * size.height);
          
          // Draw larger box marker with shadow
          final shadowPaint = Paint()
            ..color = Colors.black.withOpacity(0.3)
            ..style = PaintingStyle.fill
            ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
          
          final shadowRect = RRect.fromRectAndRadius(
            Rect.fromCenter(center: Offset(x + 2, y + 2), width: 45, height: 35),
            const Radius.circular(8),
          );
          canvas.drawRRect(shadowRect, shadowPaint);
          
          // Draw box with gradient effect
          final boxPaint = Paint()
            ..shader = ui.Gradient.linear(
              Offset(x - 22.5, y - 17.5),
              Offset(x + 22.5, y + 17.5),
              [
                (box['color'] as Color).withOpacity(0.9),
                (box['color'] as Color),
                (box['color'] as Color).withOpacity(0.7),
              ],
              [0.0, 0.5, 1.0],
            )
            ..style = PaintingStyle.fill;
          
          final rect = RRect.fromRectAndRadius(
            Rect.fromCenter(center: Offset(x, y), width: 45, height: 35),
            const Radius.circular(8),
          );
          canvas.drawRRect(rect, boxPaint);
          
          // Draw border
          final borderPaint = Paint()
            ..color = (box['color'] as Color).withOpacity(0.8)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.5;
          canvas.drawRRect(rect, borderPaint);
          
          // Draw box value with shadow
          final textPainter = TextPainter(
            text: TextSpan(
              text: box['value'] as String,
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
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
            textDirection: TextDirection.ltr,
          );
          textPainter.layout();
          textPainter.paint(
            canvas, 
            Offset(x - textPainter.width / 2, y - textPainter.height / 2),
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
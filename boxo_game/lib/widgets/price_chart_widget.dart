import 'dart:math';
import 'package:flutter/material.dart';

class PriceChartWidget extends StatelessWidget {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;

  const PriceChartWidget({
    super.key,
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: PriceChartPainter(
        priceHistory: priceHistory,
        currentPrice: currentPrice,
        placedBoxes: placedBoxes,
      ),
      child: Container(),
    );
  }
}

class PriceChartPainter extends CustomPainter {
  final List<double> priceHistory;
  final double currentPrice;
  final List<Map<String, dynamic>> placedBoxes;

  PriceChartPainter({
    required this.priceHistory,
    required this.currentPrice,
    required this.placedBoxes,
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

    // Draw grid lines
    final gridPaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..strokeWidth = 0.5;

    // Horizontal grid lines
    for (int i = 0; i <= 5; i++) {
      final y = size.height * i / 5;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Vertical grid lines
    for (int i = 0; i <= 10; i++) {
      final x = size.width * i / 10;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }

    // Draw price line
    final linePaint = Paint()
      ..color = Colors.greenAccent
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final path = Path();
    for (int i = 0; i < priceHistory.length; i++) {
      final x = size.width * i / (priceHistory.length - 1);
      final y = size.height - ((priceHistory[i] - minPrice) / priceRange * size.height);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    canvas.drawPath(path, linePaint);

    // Draw current price point
    final currentX = size.width;
    final currentY = size.height - ((currentPrice - minPrice) / priceRange * size.height);
    
    final pointPaint = Paint()
      ..color = Colors.greenAccent
      ..style = PaintingStyle.fill;
    
    canvas.drawCircle(Offset(currentX, currentY), 4, pointPaint);

    // Draw price label
    final textPainter = TextPainter(
      text: TextSpan(
        text: '\$${currentPrice.toStringAsFixed(2)}',
        style: const TextStyle(
          color: Colors.greenAccent,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(size.width - textPainter.width - 10, currentY - 25));

    // Draw placed boxes on the chart
    for (var box in placedBoxes) {
      if (box['timestamp'] != null && box['price'] != null) {
        final boxTime = box['timestamp'] as int;
        final boxPrice = box['price'] as double;
        final currentTime = DateTime.now().millisecondsSinceEpoch;
        final timeRange = 60000; // 60 seconds of history
        
        // Calculate x position based on time
        final timeDiff = currentTime - boxTime;
        if (timeDiff <= timeRange) {
          final x = size.width * (1 - timeDiff / timeRange);
          final y = size.height - ((boxPrice - minPrice) / priceRange * size.height);
          
          // Draw box marker
          final boxPaint = Paint()
            ..color = box['color'] as Color
            ..style = PaintingStyle.fill;
          
          final rect = RRect.fromRectAndRadius(
            Rect.fromCenter(center: Offset(x, y), width: 30, height: 20),
            const Radius.circular(4),
          );
          canvas.drawRRect(rect, boxPaint);
          
          // Draw box value
          final boxTextPainter = TextPainter(
            text: TextSpan(
              text: box['value'] as String,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
            textDirection: TextDirection.ltr,
          );
          boxTextPainter.layout();
          boxTextPainter.paint(
            canvas, 
            Offset(x - boxTextPainter.width / 2, y - boxTextPainter.height / 2),
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
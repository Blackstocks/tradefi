import 'dart:math';
import 'package:flutter/material.dart';

class CandlestickChartWidget extends StatelessWidget {
  final List<CandleData> candles;
  final List<Map<String, dynamic>> placedBoxes;
  final double currentPrice;

  const CandlestickChartWidget({
    super.key,
    required this.candles,
    required this.placedBoxes,
    required this.currentPrice,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: CandlestickPainter(
        candles: candles,
        placedBoxes: placedBoxes,
        currentPrice: currentPrice,
      ),
      child: Container(),
    );
  }
}

class CandleData {
  final double open;
  final double close;
  final double high;
  final double low;
  final DateTime time;

  CandleData({
    required this.open,
    required this.close,
    required this.high,
    required this.low,
    required this.time,
  });
}

class CandlestickPainter extends CustomPainter {
  final List<CandleData> candles;
  final List<Map<String, dynamic>> placedBoxes;
  final double currentPrice;

  CandlestickPainter({
    required this.candles,
    required this.placedBoxes,
    required this.currentPrice,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (candles.isEmpty) return;

    // Find price range
    double minPrice = candles.map((c) => c.low).reduce(min);
    double maxPrice = candles.map((c) => c.high).reduce(max);
    double priceRange = maxPrice - minPrice;
    if (priceRange == 0) priceRange = 1;

    // Add padding
    minPrice -= priceRange * 0.1;
    maxPrice += priceRange * 0.1;
    priceRange = maxPrice - minPrice;

    // Draw grid
    final gridPaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..strokeWidth = 0.5;

    for (int i = 0; i <= 5; i++) {
      final y = size.height * i / 5;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
      
      // Draw price labels
      final price = maxPrice - (priceRange * i / 5);
      final textPainter = TextPainter(
        text: TextSpan(
          text: price.toStringAsFixed(2),
          style: TextStyle(
            color: Colors.white.withOpacity(0.3),
            fontSize: 10,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(size.width - 35, y - 5));
    }

    // Draw candles
    final candleWidth = size.width / candles.length * 0.7;
    final spacing = size.width / candles.length * 0.3;

    for (int i = 0; i < candles.length; i++) {
      final candle = candles[i];
      final x = i * (candleWidth + spacing) + spacing / 2 + candleWidth / 2;

      // Calculate positions
      final openY = size.height - ((candle.open - minPrice) / priceRange * size.height);
      final closeY = size.height - ((candle.close - minPrice) / priceRange * size.height);
      final highY = size.height - ((candle.high - minPrice) / priceRange * size.height);
      final lowY = size.height - ((candle.low - minPrice) / priceRange * size.height);

      final isGreen = candle.close >= candle.open;
      final color = isGreen ? Colors.greenAccent : Colors.redAccent;

      // Draw wick
      final wickPaint = Paint()
        ..color = color.withOpacity(0.6)
        ..strokeWidth = 1;
      canvas.drawLine(Offset(x, highY), Offset(x, lowY), wickPaint);

      // Draw body
      final bodyPaint = Paint()
        ..color = color
        ..style = isGreen ? PaintingStyle.stroke : PaintingStyle.fill
        ..strokeWidth = 2;

      final rect = Rect.fromLTRB(
        x - candleWidth / 2,
        min(openY, closeY),
        x + candleWidth / 2,
        max(openY, closeY),
      );
      
      if (isGreen) {
        canvas.drawRect(rect, bodyPaint);
      } else {
        final rRect = RRect.fromRectAndRadius(rect, const Radius.circular(2));
        canvas.drawRRect(rRect, bodyPaint);
      }
    }

    // Draw current price line
    final currentY = size.height - ((currentPrice - minPrice) / priceRange * size.height);
    final pricePaint = Paint()
      ..color = Colors.yellowAccent
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    
    final path = Path()
      ..moveTo(0, currentY)
      ..lineTo(size.width, currentY);
    
    // Dashed line effect
    for (double i = 0; i < size.width; i += 5) {
      canvas.drawLine(
        Offset(i, currentY),
        Offset(min(i + 3, size.width), currentY),
        pricePaint,
      );
    }

    // Draw placed boxes as markers
    for (var box in placedBoxes) {
      if (box['timestamp'] != null && box['price'] != null) {
        final boxPrice = box['price'] as double;
        final y = size.height - ((boxPrice - minPrice) / priceRange * size.height);
        
        // Draw marker
        final markerPaint = Paint()
          ..color = box['color'] as Color
          ..style = PaintingStyle.fill;
        
        canvas.drawCircle(Offset(size.width - 20, y), 6, markerPaint);
        
        // Draw value
        final textPainter = TextPainter(
          text: TextSpan(
            text: box['value'] as String,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 8,
              fontWeight: FontWeight.bold,
            ),
          ),
          textDirection: TextDirection.ltr,
        );
        textPainter.layout();
        textPainter.paint(
          canvas,
          Offset(size.width - 20 - textPainter.width / 2, y - textPainter.height / 2),
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
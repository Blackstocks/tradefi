import 'dart:math';
import 'package:flutter/material.dart';

class ChartBackgroundEffects extends StatefulWidget {
  final double priceOffset;
  
  const ChartBackgroundEffects({
    super.key,
    this.priceOffset = 0.0,
  });

  @override
  State<ChartBackgroundEffects> createState() => _ChartBackgroundEffectsState();
}

class _ChartBackgroundEffectsState extends State<ChartBackgroundEffects>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Particle> _particles = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();

    // Create floating particles that move horizontally
    for (int i = 0; i < 15; i++) {
      _particles.add(Particle(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 2 + 1,
        speed: _random.nextDouble() * 0.02 + 0.01, // Horizontal speed
        opacity: _random.nextDouble() * 0.3 + 0.1,
      ));
    }
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
        return CustomPaint(
          painter: ParticlesPainter(
            particles: _particles,
            animation: _controller.value,
            priceOffset: widget.priceOffset,
          ),
          child: Container(),
        );
      },
    );
  }
}

class Particle {
  double x;
  double y;
  final double size;
  final double speed;
  final double opacity;

  Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
  });
}

class ParticlesPainter extends CustomPainter {
  final List<Particle> particles;
  final double animation;
  final double priceOffset;

  ParticlesPainter({
    required this.particles,
    required this.animation,
    this.priceOffset = 0.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Draw horizontal grid lines for effect
    final gridPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.02)
      ..strokeWidth = 0.5;
    
    // Draw horizontal lines that move with price
    final verticalOffset = priceOffset * size.height * 0.5; // Scale price offset to pixels
    for (int i = -2; i < 12; i++) { // Extra lines for smooth scrolling
      final baseY = size.height * i / 10;
      final y = (baseY + verticalOffset) % size.height;
      if (y >= 0 && y <= size.height) {
        canvas.drawLine(
          Offset(0, y),
          Offset(size.width, y),
          gridPaint,
        );
      }
    }
    
    // Draw moving vertical lines from right to left
    final lineSpacing = 60.0;
    final offset = (animation * lineSpacing) % lineSpacing;
    
    for (double x = size.width + lineSpacing - offset; x > -lineSpacing; x -= lineSpacing) {
      canvas.drawLine(
        Offset(x, 0),
        Offset(x, size.height),
        gridPaint,
      );
    }
    
    // Draw particles moving from right to left
    for (var particle in particles) {
      // Update particle position horizontally (right to left)
      particle.x -= particle.speed;
      if (particle.x < -0.1) {
        particle.x = 1.1;
        particle.y = Random().nextDouble();
      }

      final paint = Paint()
        ..color = Colors.cyanAccent.withOpacity(particle.opacity)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);

      // Apply vertical offset to particles based on price movement
      final particleY = (particle.y * size.height + verticalOffset) % size.height;
      canvas.drawCircle(
        Offset(particle.x * size.width, particleY),
        particle.size,
        paint,
      );
    }
    
    // Add subtle wave pattern moving from right to left
    final wavePath = Path();
    final waveOffset = -animation * size.width * 2; // Negative for right to left
    
    for (double x = 0; x <= size.width; x += 2) {
      final baseY = size.height / 2 + 
                sin((x + waveOffset) * 0.01) * 20 +
                sin((x + waveOffset) * 0.02) * 15;
      final y = baseY + verticalOffset; // Apply price movement offset
      
      if (x == 0) {
        wavePath.moveTo(x, y);
      } else {
        wavePath.lineTo(x, y);
      }
    }
    
    final wavePaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.03)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    
    canvas.drawPath(wavePath, wavePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
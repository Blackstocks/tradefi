import 'dart:math';
import 'package:flutter/material.dart';

class ParticleExplosion extends StatefulWidget {
  final Offset center;
  final Color color;
  final int particleCount;
  final VoidCallback? onComplete;

  const ParticleExplosion({
    super.key,
    required this.center,
    required this.color,
    this.particleCount = 20,
    this.onComplete,
  });

  @override
  State<ParticleExplosion> createState() => _ParticleExplosionState();
}

class _ParticleExplosionState extends State<ParticleExplosion>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Particle> _particles;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _initializeParticles();

    _controller.forward().then((_) {
      widget.onComplete?.call();
    });
  }

  void _initializeParticles() {
    final random = Random();
    _particles = List.generate(widget.particleCount, (index) {
      final angle = (2 * pi * index) / widget.particleCount;
      final velocity = 100.0 + random.nextDouble() * 150.0;
      return Particle(
        angle: angle,
        velocity: velocity,
        size: 4.0 + random.nextDouble() * 4.0,
      );
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
        return CustomPaint(
          painter: ParticlePainter(
            particles: _particles,
            progress: _controller.value,
            color: widget.color,
            center: widget.center,
          ),
          size: MediaQuery.of(context).size,
        );
      },
    );
  }
}

class Particle {
  final double angle;
  final double velocity;
  final double size;

  Particle({
    required this.angle,
    required this.velocity,
    required this.size,
  });
}

class ParticlePainter extends CustomPainter {
  final List<Particle> particles;
  final double progress;
  final Color color;
  final Offset center;

  ParticlePainter({
    required this.particles,
    required this.progress,
    required this.color,
    required this.center,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill;

    for (final particle in particles) {
      final distance = particle.velocity * progress;
      final x = center.dx + cos(particle.angle) * distance;
      final y = center.dy + sin(particle.angle) * distance;
      
      final opacity = 1.0 - progress;
      final currentSize = particle.size * (1.0 - progress * 0.5);
      
      paint.color = color.withOpacity(opacity);
      
      canvas.drawCircle(
        Offset(x, y),
        currentSize,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
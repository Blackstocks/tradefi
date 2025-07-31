import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({Key? key}) : super(key: key);

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen>
    with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _pulseController;
  late AnimationController _waveController;
  late AnimationController _particleController;
  late AnimationController _progressController;
  
  late Animation<double> _rotationAnimation;
  late Animation<double> _pulseAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _progressAnimation;
  
  final List<Particle> _particles = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    
    // Rotation animation for the main loader
    _rotationController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();
    
    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(CurvedAnimation(
      parent: _rotationController,
      curve: Curves.linear,
    ));
    
    // Pulse animation
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
    
    // Wave animation
    _waveController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat();
    
    _waveAnimation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(_waveController);
    
    // Particle animation
    _particleController = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();
    
    // Progress animation
    _progressController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    
    _progressAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _progressController,
      curve: Curves.easeInOut,
    ));
    
    // Start progress animation
    _progressController.forward();
    
    // Initialize particles
    for (int i = 0; i < 50; i++) {
      _particles.add(Particle(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 3 + 1,
        speed: _random.nextDouble() * 0.02 + 0.005,
        angle: _random.nextDouble() * 2 * pi,
      ));
    }
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _pulseController.dispose();
    _waveController.dispose();
    _particleController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A2E),
      body: Stack(
        children: [
          // Dark background
          Container(
            color: const Color(0xFF0F0F1E),
          ),
          
          // Image with gradient blending
          Positioned.fill(
            child: Stack(
              children: [
                // Image that covers the screen with proper scaling
                Positioned.fill(
                  child: Image.asset(
                    'assets/images/boxo_logo.png',
                    fit: BoxFit.fitHeight, // This will fill the height while maintaining aspect ratio
                    errorBuilder: (context, error, stackTrace) {
                      // Fallback gradient if image not found
                      return Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              const Color(0xFF1A1A2E),
                              const Color(0xFF0F0F1E),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                
                // Lighter gradient overlay to blend with dark background
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          const Color(0xFF0F0F1E).withOpacity(0.1),
                          const Color(0xFF0F0F1E).withOpacity(0.2),
                          const Color(0xFF0F0F1E).withOpacity(0.4),
                          const Color(0xFF0F0F1E).withOpacity(0.7),
                        ],
                        stops: const [0.0, 0.4, 0.7, 1.0],
                      ),
                    ),
                  ),
                ),
                
                // Subtle edge fade for seamless blending
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          const Color(0xFF0F0F1E).withOpacity(0.5),
                          const Color(0xFF0F0F1E).withOpacity(0.1),
                          Colors.transparent,
                          Colors.transparent,
                          const Color(0xFF0F0F1E).withOpacity(0.1),
                          const Color(0xFF0F0F1E).withOpacity(0.5),
                        ],
                        stops: const [0.0, 0.05, 0.15, 0.85, 0.95, 1.0],
                      ),
                    ),
                  ),
                ),
                
                // Lighter vignette effect
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: RadialGradient(
                        center: Alignment.center,
                        radius: 1.0,
                        colors: [
                          Colors.transparent,
                          const Color(0xFF0F0F1E).withOpacity(0.1),
                          const Color(0xFF0F0F1E).withOpacity(0.3),
                          const Color(0xFF0F0F1E).withOpacity(0.5),
                        ],
                        stops: const [0.4, 0.6, 0.8, 1.0],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Loading progress bar at 15% from bottom
          Positioned(
            left: 40,
            right: 40,
            bottom: MediaQuery.of(context).size.height * 0.15,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Loading text with yellow glow
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return Container(
                      decoration: BoxDecoration(
                        boxShadow: [
                          BoxShadow(
                            color: Colors.yellow.withOpacity(0.6 * _pulseAnimation.value),
                            blurRadius: 25,
                            spreadRadius: 5,
                          ),
                          BoxShadow(
                            color: Colors.orange.withOpacity(0.3 * _pulseAnimation.value),
                            blurRadius: 35,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                      child: const Text(
                        'LOADING',
                        style: TextStyle(
                          color: Colors.yellow,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 4,
                        ),
                      ),
                    );
                  },
                ),
                
                const SizedBox(height: 20),
                
                // Progress bar with yellow glow
                AnimatedBuilder(
                  animation: _progressAnimation,
                  builder: (context, child) {
                    return Container(
                      height: 12,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6),
                        color: Colors.grey[900],
                        boxShadow: [
                          BoxShadow(
                            color: Colors.yellow.withOpacity(0.5),
                            blurRadius: 20,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Stack(
                          children: [
                            // Background track
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: Colors.yellow.withOpacity(0.2),
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            // Progress fill
                            FractionallySizedBox(
                              widthFactor: _progressAnimation.value,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.orange,
                                      Colors.yellow,
                                      Colors.yellowAccent,
                                    ],
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.yellow.withOpacity(0.7),
                                      blurRadius: 10,
                                      spreadRadius: 1,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            // Animated glow line at the end
                            if (_progressAnimation.value > 0)
                              Positioned(
                                left: MediaQuery.of(context).size.width * 0.75 * _progressAnimation.value - 15,
                                top: 0,
                                bottom: 0,
                                child: Container(
                                  width: 30,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.transparent,
                                        Colors.yellowAccent.withOpacity(0.8),
                                        Colors.transparent,
                                      ],
                                      begin: Alignment.centerLeft,
                                      end: Alignment.centerRight,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                
                const SizedBox(height: 15),
                
                // Percentage text
                AnimatedBuilder(
                  animation: _progressAnimation,
                  builder: (context, child) {
                    return Text(
                      '${(_progressAnimation.value * 100).toInt()}%',
                      style: TextStyle(
                        color: Colors.yellow.withOpacity(0.8),
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Particle {
  double x;
  double y;
  final double size;
  final double speed;
  final double angle;

  Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.angle,
  });
}

class BackgroundPainter extends CustomPainter {
  final List<Particle> particles;
  final double animation;
  final double waveAnimation;

  BackgroundPainter({
    required this.particles,
    required this.animation,
    required this.waveAnimation,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Draw gradient background
    final gradient = Paint()
      ..shader = RadialGradient(
        center: Alignment.center,
        radius: 1.5,
        colors: [
          const Color(0xFF1A1A2E),
          const Color(0xFF0F0F1E),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), gradient);
    
    // Draw wave patterns
    final wavePath = Path();
    for (double x = 0; x <= size.width; x += 2) {
      final y = size.height / 2 + 
                sin((x / size.width * 4 * pi) + waveAnimation) * 30 +
                sin((x / size.width * 2 * pi) - waveAnimation * 2) * 20;
      
      if (x == 0) {
        wavePath.moveTo(x, y);
      } else {
        wavePath.lineTo(x, y);
      }
    }
    
    final wavePaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.1)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    
    canvas.drawPath(wavePath, wavePaint);
    
    // Draw particles
    for (var particle in particles) {
      // Update particle position
      particle.x += cos(particle.angle) * particle.speed;
      particle.y += sin(particle.angle) * particle.speed;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = 1;
      if (particle.x > 1) particle.x = 0;
      if (particle.y < 0) particle.y = 1;
      if (particle.y > 1) particle.y = 0;
      
      final paint = Paint()
        ..color = Colors.cyanAccent.withOpacity(0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
      
      canvas.drawCircle(
        Offset(particle.x * size.width, particle.y * size.height),
        particle.size,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class LoaderPainter extends CustomPainter {
  final double rotation;

  LoaderPainter({required this.rotation});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 3;
    
    // Save canvas state
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(rotation);
    canvas.translate(-center.dx, -center.dy);
    
    // Draw outer ring segments
    final segmentPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;
    
    const segmentCount = 8;
    const segmentAngle = (2 * pi) / segmentCount;
    const gapAngle = segmentAngle * 0.2;
    
    for (int i = 0; i < segmentCount; i++) {
      final startAngle = i * segmentAngle;
      final sweepAngle = segmentAngle - gapAngle;
      
      // Create gradient effect
      final opacity = (i / segmentCount);
      segmentPaint.color = Colors.cyanAccent.withOpacity(0.3 + opacity * 0.7);
      
      // Add glow effect
      segmentPaint.maskFilter = MaskFilter.blur(
        BlurStyle.normal,
        2 + opacity * 3,
      );
      
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        false,
        segmentPaint,
      );
    }
    
    // Restore canvas state
    canvas.restore();
    
    // Draw inner rotating elements
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-rotation * 2);
    canvas.translate(-center.dx, -center.dy);
    
    // Draw inner hexagon
    final hexPath = Path();
    const hexSides = 6;
    final hexRadius = radius * 0.5;
    
    for (int i = 0; i <= hexSides; i++) {
      final angle = (i * 2 * pi) / hexSides;
      final x = center.dx + hexRadius * cos(angle);
      final y = center.dy + hexRadius * sin(angle);
      
      if (i == 0) {
        hexPath.moveTo(x, y);
      } else {
        hexPath.lineTo(x, y);
      }
    }
    
    final hexPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 5);
    
    canvas.drawPath(hexPath, hexPaint);
    
    // Draw center dot with glow
    final centerPaint = Paint()
      ..color = Colors.white
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    
    canvas.drawCircle(center, 8, centerPaint);
    canvas.drawCircle(center, 5, Paint()..color = Colors.cyanAccent);
    
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
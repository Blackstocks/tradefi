import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'dart:ui' as ui;

class BoxOpeningAnimation extends StatefulWidget {
  final VoidCallback onComplete;
  
  const BoxOpeningAnimation({
    super.key,
    required this.onComplete,
  });

  @override
  State<BoxOpeningAnimation> createState() => _BoxOpeningAnimationState();
}

class _BoxOpeningAnimationState extends State<BoxOpeningAnimation>
    with TickerProviderStateMixin {
  // Main controllers
  late AnimationController _boxController;
  late AnimationController _shakeController;
  late AnimationController _lightController;
  late AnimationController _particleController;
  late AnimationController _starController;
  late AnimationController _pulseController;
  
  // Box animations
  late Animation<double> _boxScaleAnimation;
  late Animation<double> _boxRotationAnimation;
  late Animation<double> _lidOpenAnimation;
  late Animation<double> _boxShakeAnimation;
  late Animation<double> _boxFloatAnimation;
  
  // Light animations
  late Animation<double> _lightIntensityAnimation;
  late Animation<double> _lightSpreadAnimation;
  late Animation<double> _lightBeamAnimation;
  late Animation<double> _glowAnimation;
  
  // Effect animations
  late Animation<double> _starRotationAnimation;
  late Animation<double> _pulseAnimation;
  
  final List<Particle> particles = [];
  final List<LightRay> lightRays = [];
  final math.Random random = math.Random();

  @override
  void initState() {
    super.initState();
    
    // Initialize controllers
    _boxController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );
    
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _lightController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _particleController = AnimationController(
      duration: const Duration(milliseconds: 4000),
      vsync: this,
    );
    
    _starController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );
    
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    // Setup animations
    _setupAnimations();
    
    // Generate particles and light rays
    _generateEffects();
    
    // Start animation sequence
    _startAnimationSequence();
  }
  
  void _setupAnimations() {
    // Box entrance
    _boxScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.2).chain(CurveTween(curve: Curves.elasticOut)),
        weight: 60,
      ),
      TweenSequenceItem(
        tween: Tween(begin: 1.2, end: 1.0).chain(CurveTween(curve: Curves.easeOut)),
        weight: 40,
      ),
    ]).animate(_boxController);
    
    // Box rotation with anticipation
    _boxRotationAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: -0.1).chain(CurveTween(curve: Curves.easeOut)),
        weight: 20,
      ),
      TweenSequenceItem(
        tween: Tween(begin: -0.1, end: 1.0).chain(CurveTween(curve: Curves.easeInOut)),
        weight: 80,
      ),
    ]).animate(_boxController);
    
    // Box floating effect
    _boxFloatAnimation = Tween<double>(
      begin: 0.0,
      end: 2 * math.pi,
    ).animate(_boxController);
    
    // Lid opening with anticipation
    _lidOpenAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 0.05).chain(CurveTween(curve: Curves.easeOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween(begin: 0.05, end: -0.9).chain(CurveTween(curve: Curves.elasticOut)),
        weight: 70,
      ),
    ]).animate(CurvedAnimation(
      parent: _boxController,
      curve: const Interval(0.4, 0.8),
    ));
    
    // Box shake
    _boxShakeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _shakeController,
      curve: Curves.easeInOut,
    ));
    
    // Light effects
    _lightIntensityAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 0.3).chain(CurveTween(curve: Curves.easeIn)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween(begin: 0.3, end: 1.0).chain(CurveTween(curve: Curves.easeOut)),
        weight: 70,
      ),
    ]).animate(_lightController);
    
    _lightSpreadAnimation = Tween<double>(
      begin: 0.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _lightController,
      curve: Curves.easeOut,
    ));
    
    _lightBeamAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _lightController,
      curve: const Interval(0.3, 1.0, curve: Curves.easeOut),
    ));
    
    _glowAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(_pulseController);
    
    // Star rotation
    _starRotationAnimation = Tween<double>(
      begin: 0.0,
      end: 2 * math.pi,
    ).animate(_starController);
    
    // Pulse effect
    _pulseAnimation = Tween<double>(
      begin: 0.9,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
  }
  
  void _generateEffects() {
    // Generate particles
    for (int i = 0; i < 80; i++) {
      particles.add(Particle(
        x: random.nextDouble() * 2 - 1,
        y: random.nextDouble() * 2 - 1,
        size: random.nextDouble() * 6 + 2,
        color: [
          Colors.amber,
          Colors.orange,
          Colors.yellow,
          Colors.white,
          Colors.deepPurple.shade300,
        ][random.nextInt(5)],
        speed: random.nextDouble() * 0.8 + 0.3,
        delay: random.nextDouble() * 0.5,
      ));
    }
    
    // Generate light rays
    for (int i = 0; i < 12; i++) {
      lightRays.add(LightRay(
        angle: (i * 30.0) * math.pi / 180,
        length: random.nextDouble() * 100 + 150,
        width: random.nextDouble() * 3 + 1,
        speed: random.nextDouble() * 0.5 + 0.5,
      ));
    }
  }
  
  void _startAnimationSequence() async {
    // Start with box entrance
    _boxController.forward();
    _starController.repeat();
    _pulseController.repeat(reverse: true);
    
    // Start shake after delay
    await Future.delayed(const Duration(milliseconds: 800));
    _shakeController.forward();
    
    // Start light effects
    await Future.delayed(const Duration(milliseconds: 400));
    _lightController.forward();
    _particleController.repeat();
    
    // Complete animation
    _boxController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        Future.delayed(const Duration(milliseconds: 800), () {
          if (mounted) widget.onComplete();
        });
      }
    });
  }

  @override
  void dispose() {
    _boxController.dispose();
    _shakeController.dispose();
    _lightController.dispose();
    _particleController.dispose();
    _starController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        _boxController,
        _shakeController,
        _lightController,
        _particleController,
        _starController,
        _pulseController,
      ]),
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              colors: [
                Colors.deepPurple.shade900.withOpacity(0.95),
                Colors.black.withOpacity(0.98),
              ],
              radius: 1.5,
            ),
          ),
          child: Stack(
            children: [
              // Background stars
              ..._buildBackgroundStars(),
              
              // Radial light burst
              if (_lightIntensityAnimation.value > 0)
                Center(
                  child: Transform.scale(
                    scale: _lightSpreadAnimation.value,
                    child: Container(
                      width: 400,
                      height: 400,
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          colors: [
                            Colors.amber.withOpacity(0.4 * _lightIntensityAnimation.value),
                            Colors.orange.withOpacity(0.2 * _lightIntensityAnimation.value),
                            Colors.deepPurple.withOpacity(0.1 * _lightIntensityAnimation.value),
                            Colors.transparent,
                          ],
                          stops: const [0.0, 0.3, 0.6, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),
              
              // Light rays
              if (_lightBeamAnimation.value > 0)
                Center(
                  child: Transform.rotate(
                    angle: _starRotationAnimation.value * 0.2,
                    child: Stack(
                      children: lightRays.map((ray) => _buildLightRay(ray)).toList(),
                    ),
                  ),
                ),
              
              // Particles
              ...particles.map((particle) => _buildParticle(particle)),
              
              // Main box with effects
              Center(
                child: Transform.translate(
                  offset: Offset(
                    math.sin(_boxShakeAnimation.value * math.pi * 10) * 5,
                    math.sin(_boxFloatAnimation.value) * 10,
                  ),
                  child: Transform.scale(
                    scale: _boxScaleAnimation.value * _pulseAnimation.value,
                    child: Transform.rotate(
                      angle: _boxRotationAnimation.value * math.pi * 2,
                      child: _buildBox(),
                    ),
                  ),
                ),
              ),
              
              // Title and effects overlay
              _buildTitleOverlay(),
            ],
          ),
        );
      },
    );
  }
  
  Widget _buildBox() {
    return SizedBox(
      width: 200,
      height: 200,
      child: Stack(
        children: [
          // Shadow
          Positioned(
            bottom: -20,
            left: 20,
            right: 20,
            child: Container(
              height: 40,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 10,
                  ),
                ],
              ),
            ),
          ),
          
          // Box base with shimmer
          Positioned(
            bottom: 0,
            child: ShaderMask(
              shaderCallback: (bounds) {
                return ui.Gradient.linear(
                  Offset(-bounds.width + (_boxController.value * bounds.width * 3), 0),
                  Offset(bounds.width + (_boxController.value * bounds.width * 3), 0),
                  [
                    Colors.transparent,
                    Colors.white.withOpacity(0.3),
                    Colors.transparent,
                  ],
                  [0.0, 0.5, 1.0],
                );
              },
              child: Container(
                width: 200,
                height: 150,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFF6A1B9A),
                      Color(0xFF4A148C),
                      Color(0xFF311B92),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepPurple.withOpacity(0.6 * _glowAnimation.value),
                      blurRadius: 30,
                      spreadRadius: 10,
                    ),
                  ],
                ),
                child: _buildBoxPattern(),
              ),
            ),
          ),
          
          // Inner glow
          if (_lightIntensityAnimation.value > 0)
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.transparent,
                      Colors.amber.withOpacity(0.3 * _lightIntensityAnimation.value),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
          
          // Light beam
          if (_lightBeamAnimation.value > 0)
            Positioned(
              top: 20,
              left: 50,
              child: Container(
                width: 100,
                height: 300 * _lightBeamAnimation.value,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.amber.withOpacity(0.8 * _lightBeamAnimation.value),
                      Colors.amber.withOpacity(0.4 * _lightBeamAnimation.value),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.3, 1.0],
                  ),
                ),
              ),
            ),
          
          // Box lid
          Positioned(
            top: 0,
            child: Transform(
              alignment: Alignment.bottomCenter,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateX(_lidOpenAnimation.value),
              child: Container(
                width: 200,
                height: 80,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFF8E24AA),
                      Color(0xFF6A1B9A),
                      Color(0xFF4A148C),
                    ],
                  ),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(20),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepPurple.withOpacity(0.4),
                      blurRadius: 15,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: Center(
                  child: Transform.rotate(
                    angle: _starRotationAnimation.value,
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            Colors.amber,
                            Colors.orange.shade600,
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.amber.withOpacity(0.6),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.star,
                        color: Colors.white,
                        size: 35,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildBoxPattern() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Stack(
        children: [
          // Geometric patterns
          Positioned(
            right: -20,
            bottom: -20,
            child: Transform.rotate(
              angle: _boxController.value * math.pi,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withOpacity(0.1),
                    width: 2,
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            left: -30,
            top: 20,
            child: Transform.rotate(
              angle: -_boxController.value * math.pi,
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withOpacity(0.1),
                    width: 2,
                  ),
                ),
              ),
            ),
          ),
          // Hexagon pattern
          Center(
            child: CustomPaint(
              size: const Size(80, 80),
              painter: HexagonPatternPainter(
                opacity: 0.05,
                rotation: _boxController.value * math.pi,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  List<Widget> _buildBackgroundStars() {
    return List.generate(30, (index) {
      final size = random.nextDouble() * 3 + 1;
      final top = random.nextDouble() * MediaQuery.of(context).size.height;
      final left = random.nextDouble() * MediaQuery.of(context).size.width;
      
      return Positioned(
        top: top,
        left: left,
        child: Opacity(
          opacity: random.nextDouble() * 0.8 + 0.2,
          child: Container(
            width: size,
            height: size,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
            ),
          ),
        ),
      );
    });
  }
  
  Widget _buildLightRay(LightRay ray) {
    return Center(
      child: Transform.rotate(
        angle: ray.angle,
        child: Container(
          width: ray.width,
          height: ray.length * _lightBeamAnimation.value,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.center,
              end: Alignment.topCenter,
              colors: [
                Colors.amber.withOpacity(0.6 * _lightBeamAnimation.value),
                Colors.transparent,
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildParticle(Particle particle) {
    final progress = (_particleController.value - particle.delay).clamp(0.0, 1.0);
    final x = particle.x * 400 * progress * particle.speed;
    final y = particle.y * 400 * progress * particle.speed - 200 * progress;
    final opacity = (1 - progress).clamp(0.0, 1.0);
    
    return Positioned(
      left: MediaQuery.of(context).size.width / 2 + x - particle.size / 2,
      top: MediaQuery.of(context).size.height / 2 + y - particle.size / 2,
      child: Opacity(
        opacity: opacity * _lightIntensityAnimation.value,
        child: Transform.rotate(
          angle: progress * math.pi * 4,
          child: Container(
            width: particle.size,
            height: particle.size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: particle.color,
              boxShadow: [
                BoxShadow(
                  color: particle.color.withOpacity(0.8),
                  blurRadius: 10,
                  spreadRadius: 2,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildTitleOverlay() {
    return Positioned(
      bottom: 80,
      left: 0,
      right: 0,
      child: Column(
        children: [
          Opacity(
            opacity: _lightIntensityAnimation.value,
            child: ShaderMask(
              shaderCallback: (bounds) {
                return const LinearGradient(
                  colors: [Colors.amber, Colors.orange, Colors.amber],
                ).createShader(bounds);
              },
              child: const Text(
                'OPENING REWARDS',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Opacity(
            opacity: _boxController.value,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.amber.withOpacity(0.3),
                  width: 1,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                'EMERALD LEAGUE',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.8),
                  fontSize: 14,
                  letterSpacing: 2,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class Particle {
  final double x;
  final double y;
  final double size;
  final Color color;
  final double speed;
  final double delay;
  
  Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.color,
    required this.speed,
    required this.delay,
  });
}

class LightRay {
  final double angle;
  final double length;
  final double width;
  final double speed;
  
  LightRay({
    required this.angle,
    required this.length,
    required this.width,
    required this.speed,
  });
}

class HexagonPatternPainter extends CustomPainter {
  final double opacity;
  final double rotation;
  
  HexagonPatternPainter({required this.opacity, required this.rotation});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    
    canvas.save();
    canvas.translate(size.width / 2, size.height / 2);
    canvas.rotate(rotation);
    
    final path = Path();
    final radius = size.width / 2;
    
    for (int i = 0; i < 6; i++) {
      final angle = (i * 60 - 30) * math.pi / 180;
      final x = radius * math.cos(angle);
      final y = radius * math.sin(angle);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();
    
    canvas.drawPath(path, paint);
    canvas.restore();
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:math' as math;
import 'box_opening_animation.dart';

class GameResultOverlay extends StatefulWidget {
  final bool isWin;
  final double score;
  final double profit;
  final VoidCallback onPlayAgain;

  const GameResultOverlay({
    super.key,
    required this.isWin,
    required this.score,
    required this.profit,
    required this.onPlayAgain,
  });

  @override
  State<GameResultOverlay> createState() => _GameResultOverlayState();
}

class _GameResultOverlayState extends State<GameResultOverlay>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _contentController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;
  
  bool _showBoxAnimation = true;

  // Leaderboard data with iOS-style icons
  List<Map<String, dynamic>> get leaderboard => [
    {'rank': 1, 'name': 'Vaquirrer', 'score': 7440, 'icon': CupertinoIcons.star_fill, 'color': Colors.amber},
    {'rank': 2, 'name': 'John S.', 'score': widget.score.toInt(), 'icon': CupertinoIcons.person_circle_fill, 'color': Colors.blue, 'isPlayer': true},
    {'rank': 3, 'name': 'Mister-Chips', 'score': 2072, 'icon': CupertinoIcons.device_laptop, 'color': Colors.purple},
    {'rank': 4, 'name': 'Freska86', 'score': 1548, 'icon': CupertinoIcons.game_controller_solid, 'color': Colors.pink},
    {'rank': 5, 'name': 'Cezarcata47', 'score': 1260, 'icon': CupertinoIcons.suit_diamond_fill, 'color': Colors.green},
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _contentController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    // Main container animations
    _scaleAnimation = Tween<double>(
      begin: 0.95,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeIn,
    ));

    _slideAnimation = Tween<double>(
      begin: 30.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));

    // Animations will be started after box opening animation completes
  }

  @override
  void dispose() {
    _controller.dispose();
    _contentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_showBoxAnimation) {
      return BoxOpeningAnimation(
        onComplete: () {
          setState(() {
            _showBoxAnimation = false;
          });
          _controller.forward();
          Future.delayed(const Duration(milliseconds: 200), () {
            if (mounted) _contentController.forward();
          });
        },
      );
    }
    
    return AnimatedBuilder(
      animation: Listenable.merge([_controller, _contentController]),
      builder: (context, child) {
        return Container(
          color: Colors.black.withOpacity(0.9 * _fadeAnimation.value),
          child: Center(
            child: SingleChildScrollView(
              child: Transform.translate(
                offset: Offset(0, _slideAnimation.value),
                child: Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Container(
                    width: 360,
                    margin: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E2329),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Header with multiplier
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2A2E37),
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                          ),
                          child: Column(
                            children: [
                              FadeTransition(
                                opacity: _contentController.drive(
                                  CurveTween(curve: const Interval(0.0, 0.3)),
                                ),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF1E2329),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    '1.00',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                              // League badges
                              FadeTransition(
                                opacity: _contentController.drive(
                                  CurveTween(curve: const Interval(0.1, 0.4)),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    _buildLeagueBadge(Colors.green, true),
                                    _buildLeagueBadge(Colors.brown, false),
                                    _buildLeagueBadge(Colors.grey, false),
                                    _buildLeagueBadge(Colors.amber, false),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 15),
                              FadeTransition(
                                opacity: _contentController.drive(
                                  CurveTween(curve: const Interval(0.2, 0.5)),
                                ),
                                child: const Text(
                                  'Emerald League',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                              // Stats row
                              FadeTransition(
                                opacity: _contentController.drive(
                                  CurveTween(curve: const Interval(0.3, 0.6)),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                                  children: [
                                    _buildStat('7', 'Days left'),
                                    _buildStat(widget.score.toStringAsFixed(0), 'Today', Colors.greenAccent),
                                    _buildStat('2', 'Place'),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Leaderboard
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          child: Column(
                            children: List.generate(
                              leaderboard.length,
                              (index) => _buildLeaderboardItem(
                                leaderboard[index],
                                index,
                              ),
                            ),
                          ),
                        ),
                        // Play again button
                        Padding(
                          padding: const EdgeInsets.all(20),
                          child: FadeTransition(
                            opacity: _contentController.drive(
                              CurveTween(curve: const Interval(0.8, 1.0)),
                            ),
                            child: SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: widget.onPlayAgain,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF2A2E37),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: const Text(
                                  'PLAY AGAIN',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildLeagueBadge(Color color, bool isActive) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      child: CustomPaint(
        size: const Size(45, 45),
        painter: HexagonPainter(
          color: isActive ? color : color.withOpacity(0.3),
          isActive: isActive,
        ),
      ),
    );
  }

  Widget _buildStat(String value, String label, [Color? valueColor]) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.6),
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildLeaderboardItem(Map<String, dynamic> player, int index) {
    final isPlayer = player['isPlayer'] ?? false;
    final delay = 0.4 + (index * 0.1);
    final endDelay = delay + 0.2;
    
    // Ensure intervals don't exceed 1.0
    final startInterval = delay.clamp(0.0, 0.9);
    final endInterval = endDelay.clamp(startInterval, 1.0);
    
    return FadeTransition(
      opacity: _contentController.drive(
        CurveTween(
          curve: Interval(startInterval, endInterval, curve: Curves.easeOut),
        ),
      ),
      child: SlideTransition(
        position: _contentController.drive(
          Tween(begin: const Offset(0.3, 0), end: Offset.zero).chain(
            CurveTween(
              curve: Interval(startInterval, endInterval, curve: Curves.easeOut),
            ),
          ),
        ),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isPlayer ? const Color(0xFF2A3F5F) : const Color(0xFF2A2E37),
            borderRadius: BorderRadius.circular(12),
            border: isPlayer ? Border.all(color: Colors.blue.withOpacity(0.5), width: 1) : null,
          ),
          child: Row(
            children: [
              // Rank
              SizedBox(
                width: 30,
                child: Text(
                  '${player['rank']}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Icon
              Icon(
                player['icon'],
                color: player['color'],
                size: 24,
              ),
              const SizedBox(width: 12),
              // Name
              Expanded(
                child: Text(
                  player['name'],
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: isPlayer ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
              // Score
              Text(
                player['score'].toString(),
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HexagonPainter extends CustomPainter {
  final Color color;
  final bool isActive;

  HexagonPainter({required this.color, required this.isActive});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final path = Path();

    // Create hexagon path
    for (int i = 0; i < 6; i++) {
      final angle = (i * 60 - 30) * 3.14159 / 180;
      final x = center.dx + radius * cos(angle);
      final y = center.dy + radius * sin(angle);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();

    // Add glow effect for active badge
    if (isActive) {
      final glowPaint = Paint()
        ..color = color.withOpacity(0.3)
        ..style = PaintingStyle.fill
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
      canvas.drawPath(path, glowPaint);
    }

    canvas.drawPath(path, paint);

    // Add inner highlight
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(isActive ? 0.3 : 0.1)
      ..style = PaintingStyle.fill;

    final highlightPath = Path();
    for (int i = 0; i < 6; i++) {
      final angle = (i * 60 - 30) * 3.14159 / 180;
      final x = center.dx + radius * 0.7 * cos(angle);
      final y = center.dy + radius * 0.7 * sin(angle);
      
      if (i == 0) {
        highlightPath.moveTo(x, y);
      } else {
        highlightPath.lineTo(x, y);
      }
    }
    highlightPath.close();
    canvas.drawPath(highlightPath, highlightPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;

  double cos(double radians) => math.cos(radians);
  double sin(double radians) => math.sin(radians);
}
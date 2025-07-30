import 'package:flutter/material.dart';

class BonusProgressBar extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final int totalDots;
  final String currentValue;
  final String maxValue;

  const BonusProgressBar({
    super.key,
    required this.progress,
    this.totalDots = 25,
    required this.currentValue,
    required this.maxValue,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Row(
        children: [
          const Text(
            'BONUS',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Container(
              height: 20,
              child: Stack(
                children: [
                  // Background dots
                  Row(
                    children: List.generate(totalDots, (index) {
                      final isActive = (index / totalDots) < progress;
                      return Expanded(
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 1),
                          height: 8,
                          decoration: BoxDecoration(
                            color: isActive ? Colors.greenAccent : Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 15),
          Row(
            children: [
              Text(
                currentValue,
                style: const TextStyle(
                  color: Colors.greenAccent,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                ' | $maxValue',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.5),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
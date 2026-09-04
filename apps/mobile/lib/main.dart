import 'package:flutter/material.dart';

import 'presentation/pages/home_page.dart';

void main() {
  runApp(const LedgerlineApp());
}

class LedgerlineApp extends StatelessWidget {
  const LedgerlineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ledgerline',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2C4A6E)),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

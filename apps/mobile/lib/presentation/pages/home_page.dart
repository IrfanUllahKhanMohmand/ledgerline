import 'package:flutter/material.dart';

import '../../domain/entities/item.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static final _item = Item(
    id: 'item-receipt-1',
    userId: 'user-maya',
    title: 'Cafe receipt',
    status: ItemStatus.pending,
    attemptCount: 0,
    createdAt: DateTime.utc(2026, 9, 4),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ledgerline')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your items',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            const Text(
              'Add a photo and a short note. If an upload fails, you can retry it.',
            ),
            const SizedBox(height: 24),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(_item.title),
              subtitle: Text('Status: ${_item.status.name}'),
            ),
          ],
        ),
      ),
    );
  }
}

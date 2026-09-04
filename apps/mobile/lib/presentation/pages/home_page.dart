import 'package:flutter/material.dart';

import '../../domain/entities/item.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static final _demoItem = Item(
    id: 'item-scaffold',
    userId: 'user-scaffold',
    title: 'Sample receipt',
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
              'Field capture',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            const Text(
              'Submit an item with a photo, then retry if the upload fails. '
              'Auth and the capture flow come next.',
            ),
            const SizedBox(height: 24),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(_demoItem.title),
              subtitle: Text('Status: ${_demoItem.status.name}'),
            ),
          ],
        ),
      ),
    );
  }
}

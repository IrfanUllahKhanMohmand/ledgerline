import 'package:flutter/material.dart';

import '../../domain/entities/item.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key, this.initialItems});

  final List<Item>? initialItems;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late final List<Item> _items = List<Item>.from(
    widget.initialItems ?? _seed,
  );

  static final _seed = <Item>[
    Item(
      id: 'item-receipt-1',
      userId: 'user-maya',
      title: 'Cafe receipt',
      notes: 'Tuesday lunch',
      status: ItemStatus.complete,
      attemptCount: 1,
      createdAt: DateTime.utc(2026, 9, 4),
    ),
    Item(
      id: 'item-receipt-2',
      userId: 'user-maya',
      title: 'Pharmacy bill',
      notes: 'Photo upload interrupted',
      imageKey: 'bills/pharmacy.jpg',
      status: ItemStatus.failed,
      attemptCount: 1,
      createdAt: DateTime.utc(2026, 9, 21),
    ),
    Item(
      id: 'item-receipt-3',
      userId: 'user-maya',
      title: 'Train ticket',
      status: ItemStatus.pending,
      attemptCount: 0,
      createdAt: DateTime.utc(2026, 10, 9),
    ),
  ];

  String _statusLabel(ItemStatus status) {
    return switch (status) {
      ItemStatus.pending => 'Ready to upload',
      ItemStatus.uploading => 'Uploading…',
      ItemStatus.failed => 'Upload failed',
      ItemStatus.complete => 'Uploaded',
    };
  }

  Future<void> _retry(Item item) async {
    setState(() {
      final index = _items.indexWhere((entry) => entry.id == item.id);
      _items[index] = Item(
        id: item.id,
        userId: item.userId,
        title: item.title,
        notes: item.notes,
        imageKey: item.imageKey,
        status: ItemStatus.uploading,
        attemptCount: item.attemptCount + 1,
        createdAt: item.createdAt,
      );
    });

    await Future<void>.delayed(const Duration(milliseconds: 200));
    if (!mounted) {
      return;
    }

    setState(() {
      final index = _items.indexWhere((entry) => entry.id == item.id);
      final current = _items[index];
      _items[index] = Item(
        id: current.id,
        userId: current.userId,
        title: current.title,
        notes: current.notes,
        imageKey: current.imageKey,
        status: ItemStatus.complete,
        attemptCount: current.attemptCount,
        createdAt: current.createdAt,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ledgerline')),
      body: ListView(
        padding: const EdgeInsets.all(24),
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
          for (final item in _items)
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(item.title),
              subtitle: Text(
                [
                  _statusLabel(item.status),
                  if (item.notes != null) item.notes!,
                ].join(' · '),
              ),
              trailing: item.status == ItemStatus.failed
                  ? TextButton(
                      onPressed: () => _retry(item),
                      child: const Text('Retry'),
                    )
                  : null,
            ),
        ],
      ),
    );
  }
}

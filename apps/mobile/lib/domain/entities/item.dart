enum ItemStatus { pending, uploading, failed, complete }

class Item {
  const Item({
    required this.id,
    required this.userId,
    required this.title,
    required this.status,
    required this.attemptCount,
    required this.createdAt,
    this.notes,
    this.imageKey,
  });

  final String id;
  final String userId;
  final String title;
  final String? notes;
  final String? imageKey;
  final ItemStatus status;
  final int attemptCount;
  final DateTime createdAt;
}

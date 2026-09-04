enum UploadJobStatus { queued, running, failed, done }

class UploadJob {
  const UploadJob({
    required this.id,
    required this.itemId,
    required this.status,
    required this.createdAt,
    this.lastError,
    this.nextRetryAt,
  });

  final String id;
  final String itemId;
  final UploadJobStatus status;
  final String? lastError;
  final DateTime? nextRetryAt;
  final DateTime createdAt;
}

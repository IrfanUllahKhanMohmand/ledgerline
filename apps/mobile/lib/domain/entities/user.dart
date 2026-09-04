class User {
  const User({
    required this.id,
    required this.email,
    required this.createdAt,
  });

  final String id;
  final String email;
  final DateTime createdAt;
}

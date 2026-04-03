import 'package:equatable/equatable.dart';

/// User entity (domain layer - no JSON serialization)
class UserEntity extends Equatable {
  final String id;
  final String email;
  final String? fullName;
  final String? avatarUrl;
  final String companyId;
  final String role;
  final bool isActive;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const UserEntity({
    required this.id,
    required this.email,
    required this.companyId,
    this.fullName,
    this.avatarUrl,
    this.role = 'employee',
    this.isActive = true,
    required this.createdAt,
    this.updatedAt,
  });

  /// Check if user is admin
  bool get isAdmin => role == 'admin' || role == 'owner';

  /// Check if user is owner
  bool get isOwner => role == 'owner';

  @override
  List<Object?> get props => [
        id,
        email,
        fullName,
        avatarUrl,
        companyId,
        role,
        isActive,
        createdAt,
        updatedAt,
      ];

  /// Copy with modified fields
  UserEntity copyWith({
    String? id,
    String? email,
    String? fullName,
    String? avatarUrl,
    String? companyId,
    String? role,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      companyId: companyId ?? this.companyId,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

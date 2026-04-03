import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/user_entity.dart';

part 'auth_response_model.freezed.dart';
part 'auth_response_model.g.dart';

/// Auth response model (data layer)
@freezed
class AuthResponseModel with _$AuthResponseModel {
  const AuthResponseModel._();

  const factory AuthResponseModel({
    required UserModel user,
    String? accessToken,
    String? refreshToken,
  }) = _AuthResponseModel;

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseModelFromJson(json);
}

/// User model for JSON serialization
@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    String? fullName,
    String? avatarUrl,
    required String companyId,
    required String role,
    required bool isActive,
    required DateTime createdAt,
    DateTime? updatedAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

/// Extension methods for AuthResponseModel
extension AuthResponseModelMapper on AuthResponseModel {
  /// Convert to domain layer result
  (UserEntity, String?, String?) toEntity() {
    return (user.toEntity(), accessToken, refreshToken);
  }
}

/// Extension methods for UserModel
extension UserModelMapper on UserModel {
  /// Convert to domain entity
  UserEntity toEntity() {
    return UserEntity(
      id: id,
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
      companyId: companyId,
      role: role,
      isActive: isActive,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}

/// Create UserModel from entity
UserModel userModelFromEntity(UserEntity entity) {
  return UserModel(
    id: entity.id,
    email: entity.email,
    fullName: entity.fullName,
    avatarUrl: entity.avatarUrl,
    companyId: entity.companyId,
    role: entity.role,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  );
}

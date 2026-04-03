import '../entities/user_entity.dart';
import '../../../../core/utils/result.dart';

/// Auth repository interface (domain layer)
/// Defines contract for authentication operations
abstract class AuthRepository {
  /// Sign in with email and password
  Future<Result<UserEntity>> signIn({
    required String email,
    required String password,
  });

  /// Sign up with email and password
  Future<Result<UserEntity>> signUp({
    required String email,
    required String password,
    required String fullName,
    String? companyId,
  });

  /// Sign out
  Future<Result<void>> signOut();

  /// Reset password
  Future<Result<void>> resetPassword(String email);

  /// Watch auth state changes
  Stream<UserEntity?> get authState;

  /// Get current user
  UserEntity? get currentUser;

  /// Check if user is authenticated
  bool get isAuthenticated;
}

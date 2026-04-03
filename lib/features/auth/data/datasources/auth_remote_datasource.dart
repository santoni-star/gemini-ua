import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/errors/app_error.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../domain/entities/user_entity.dart';
import '../models/auth_response_model.dart';

/// Auth remote data source interface
abstract class AuthRemoteDataSource {
  /// Sign in with email and password
  Future<AuthResponseModel> signIn({
    required String email,
    required String password,
  });

  /// Sign up with email and password
  Future<AuthResponseModel> signUp({
    required String email,
    required String password,
    required String fullName,
    String? companyId,
  });

  /// Sign out
  Future<void> signOut();

  /// Reset password
  Future<void> resetPassword(String email);

  /// Watch auth state changes
  Stream<UserEntity?> get authState;

  /// Get current user
  UserEntity? get currentUser;
}

/// Supabase implementation of AuthRemoteDataSource
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final DatabaseClient client;
  final GoTrueClient authClient;

  AuthRemoteDataSourceImpl({
    required this.client,
    required this.authClient,
  });

  @override
  Future<AuthResponseModel> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await authClient.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user == null) {
        throw const AuthError(
          code: AuthErrorCode.invalidCredentials,
          message: 'Invalid credentials',
        );
      }

      // Fetch user profile from database
      final userData = await _fetchUserProfile(response.user!.id);

      return AuthResponseModel(
        user: userData,
        accessToken: response.session?.accessToken,
        refreshToken: response.session?.refreshToken,
      );
    } on AuthError {
      rethrow;
    } catch (e) {
      if (e is PostgrestException) {
        throw const AuthError(
          code: AuthErrorCode.invalidCredentials,
          message: 'Invalid email or password',
        );
      }
      throw AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
      );
    }
  }

  @override
  Future<AuthResponseModel> signUp({
    required String email,
    required String password,
    required String fullName,
    String? companyId,
  }) async {
    try {
      final response = await authClient.signUp(
        email: email,
        password: password,
        data: {
          'full_name': fullName,
          if (companyId != null) 'company_id': companyId,
        },
      );

      if (response.user == null) {
        throw const AuthError(
          code: AuthErrorCode.unknown,
          message: 'Sign up failed',
        );
      }

      // Try to create user profile in database, but don't fail if it doesn't work
      if (companyId != null) {
        try {
          await client.insert('profiles', {
            'id': response.user!.id,
            'email': email,
            'full_name': fullName,
            'company_id': companyId,
            'role': 'employee',
          });
        } catch (e) {
          // Profile creation failed, but user is still registered in Auth
          // They can login but won't have full functionality
          print('Warning: Profile creation failed: $e');
        }
      }

      return AuthResponseModel(
        user: UserModel(
          id: response.user!.id,
          email: email,
          fullName: fullName,
          companyId: companyId ?? '',
          role: 'employee',
          isActive: true,
          createdAt: DateTime.now(),
        ),
        accessToken: response.session?.accessToken,
        refreshToken: response.session?.refreshToken,
      );
    } on AuthError {
      rethrow;
    } catch (e) {
      throw AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
      );
    }
  }

  @override
  Future<void> signOut() async {
    await authClient.signOut();
  }

  @override
  Future<void> resetPassword(String email) async {
    await authClient.resetPasswordForEmail(
      email,
      redirectTo: 'yourapp://reset-password',
    );
  }

  @override
  Stream<UserEntity?> get authState {
    return authClient.onAuthStateChange.map((data) {
      final session = data.session;
      if (session == null || session.user == null) {
        return null;
      }
      return currentUser;
    });
  }

  @override
  UserEntity? get currentUser {
    final user = authClient.currentUser;
    if (user == null) return null;

    // Try to get cached profile or return basic entity
    return UserEntity(
      id: user.id,
      email: user.email ?? '',
      fullName: user.userMetadata?['full_name'] as String?,
      companyId: user.userMetadata?['company_id'] as String? ?? '',
      createdAt: DateTime.now(),
    );
  }

  /// Fetch user profile from database
  Future<UserModel> _fetchUserProfile(String userId) async {
    try {
      final users = await client.select(
        'profiles',
        match: {'id': userId},
      );

      if (users.isEmpty) {
        throw const AuthError(
          code: AuthErrorCode.userNotFound,
          message: 'User profile not found',
        );
      }

      final userData = users.first;
      return UserModel(
        id: userData['id'] as String,
        email: userData['email'] as String,
        fullName: userData['full_name'] as String?,
        avatarUrl: userData['avatar_url'] as String?,
        companyId: userData['company_id'] as String,
        role: userData['role'] as String? ?? 'employee',
        isActive: userData['is_active'] as bool? ?? true,
        createdAt: DateTime.parse(userData['created_at'] as String),
        updatedAt: userData['updated_at'] != null
            ? DateTime.parse(userData['updated_at'] as String)
            : null,
      );
    } catch (e) {
      throw AuthError(
        code: AuthErrorCode.userNotFound,
        message: 'Failed to fetch user profile',
      );
    }
  }
}

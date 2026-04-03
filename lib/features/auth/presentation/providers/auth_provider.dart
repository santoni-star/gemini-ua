import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:logger/logger.dart';
import '../../../../core/di/providers.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/usecases/auth_usecases.dart';
import '../../domain/entities/user_entity.dart';
import '../../data/models/auth_response_model.dart';

part 'auth_provider.g.dart';

final logger = Logger();

/// Auth data source provider
final authDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSourceImpl(
    client: ref.watch(databaseClientProvider),
    authClient: Supabase.instance.client.auth,
  );
});

/// Auth repository provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(ref.watch(authDataSourceProvider));
});

/// Auth state class
class AuthState {
  final UserEntity? user;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  bool get isAuthenticated => user != null;

  AuthState copyWith({
    UserEntity? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Auth notifier using Riverpod Generator
@riverpod
class Auth extends _$Auth {
  @override
  AuthState build() {
    _listenToAuthState();
    return const AuthState();
  }

  void _listenToAuthState() {
    Future.microtask(() {
      final repository = ref.read(authRepositoryProvider);
      repository.authState.listen((user) {
        if (mounted) {
          logger.d('Auth state change: ${user?.email}');
          state = state.copyWith(user: user, isLoading: false);
        }
      });
    });
  }

  Future<bool> signIn({required String email, required String password}) async {
    state = state.copyWith(isLoading: true, error: null);
    final repository = ref.read(authRepositoryProvider);
    
    logger.d('Attempting sign in: $email');
    final result = await repository.signIn(email: email, password: password);
    
    return result.when(
      success: (user) {
        logger.i('Sign in successful: ${user.email}');
        state = state.copyWith(user: user, isLoading: false);
        return true;
      },
      failure: (error) {
        logger.e('Sign in failed: ${error.message}');
        state = state.copyWith(error: error.message, isLoading: false);
        return false;
      },
    );
  }

  Future<bool> signUp({
    required String email,
    required String password,
    required String fullName,
    String? companyId,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    final repository = ref.read(authRepositoryProvider);
    
    logger.d('Attempting sign up: $email');
    final result = await repository.signUp(
      email: email,
      password: password,
      fullName: fullName,
      companyId: companyId,
    );
    
    return result.when(
      success: (user) {
        logger.i('Sign up successful: ${user.email}');
        // We don't necessarily update user here, as authState stream will handle it
        state = state.copyWith(isLoading: false);
        return true;
      },
      failure: (error) {
        logger.e('Sign up failed: ${error.message}');
        state = state.copyWith(error: error.message, isLoading: false);
        return false;
      },
    );
  }

  Future<void> signOut() async {
    final repository = ref.read(authRepositoryProvider);
    await repository.signOut();
    state = const AuthState();
  }
}

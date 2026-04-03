import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/auth_response_model.dart';

/// Auth repository implementation
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource dataSource;

  AuthRepositoryImpl(this.dataSource);

  @override
  Future<Result<UserEntity>> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await dataSource.signIn(
        email: email,
        password: password,
      );
      return Success(response.user.toEntity());
    } on AuthError catch (e) {
      return Failure(e);
    }
  }

  @override
  Future<Result<UserEntity>> signUp({
    required String email,
    required String password,
    required String fullName,
    String? companyId,
  }) async {
    try {
      final response = await dataSource.signUp(
        email: email,
        password: password,
        fullName: fullName,
        companyId: companyId,
      );
      return Success(response.user.toEntity());
    } on AuthError catch (e) {
      return Failure(e);
    }
  }

  @override
  Future<Result<void>> signOut() async {
    try {
      await dataSource.signOut();
      return const Success(null);
    } catch (e) {
      return Failure(AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
      ));
    }
  }

  @override
  Future<Result<void>> resetPassword(String email) async {
    try {
      await dataSource.resetPassword(email);
      return const Success(null);
    } catch (e) {
      return Failure(AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
      ));
    }
  }

  @override
  Stream<UserEntity?> get authState => dataSource.authState;

  @override
  UserEntity? get currentUser => dataSource.currentUser;

  @override
  bool get isAuthenticated => currentUser != null;
}

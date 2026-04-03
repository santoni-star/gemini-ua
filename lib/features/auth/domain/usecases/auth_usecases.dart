import '../../../../core/utils/base_repository.dart';
import '../../../../core/utils/result.dart';
import '../../../../core/errors/app_error.dart';
import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';
import '../../data/models/auth_response_model.dart';
import '../../data/datasources/auth_remote_datasource.dart';

/// Sign in use case
class SignInUseCase implements BaseUseCase<UserEntity, SignInParams> {
  final AuthRemoteDataSource dataSource;

  SignInUseCase(this.dataSource);

  @override
  Future<Result<UserEntity>> call(SignInParams params) async {
    try {
      final response = await dataSource.signIn(
        email: params.email,
        password: params.password,
      );
      return Success(response.user.toEntity());
    } on AuthError catch (e) {
      return Failure(e);
    } catch (e, stackTrace) {
      return Failure(AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
        stackTrace: stackTrace,
      ));
    }
  }
}

class SignInParams {
  final String email;
  final String password;

  const SignInParams({
    required this.email,
    required this.password,
  });
}

/// Sign up use case
class SignUpUseCase implements BaseUseCase<UserEntity, SignUpParams> {
  final AuthRemoteDataSource dataSource;

  SignUpUseCase(this.dataSource);

  @override
  Future<Result<UserEntity>> call(SignUpParams params) async {
    try {
      final response = await dataSource.signUp(
        email: params.email,
        password: params.password,
        fullName: params.fullName,
        companyId: params.companyId,
      );
      return Success(response.user.toEntity());
    } on AuthError catch (e) {
      return Failure(e);
    } catch (e, stackTrace) {
      return Failure(AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
        stackTrace: stackTrace,
      ));
    }
  }
}

class SignUpParams {
  final String email;
  final String password;
  final String fullName;
  final String? companyId;

  const SignUpParams({
    required this.email,
    required this.password,
    required this.fullName,
    this.companyId,
  });
}

/// Sign out use case
class SignOutUseCase implements BaseUseCaseNoParams<void> {
  final AuthRemoteDataSource dataSource;

  SignOutUseCase(this.dataSource);

  @override
  Future<Result<void>> call() async {
    try {
      await dataSource.signOut();
      return const Success(null);
    } catch (e, stackTrace) {
      return Failure(AuthError(
        code: AuthErrorCode.unknown,
        message: e.toString(),
        stackTrace: stackTrace,
      ));
    }
  }
}

/// Watch auth state use case
class WatchAuthStateUseCase implements BaseUseCaseNoParams<Stream<UserEntity?>> {
  final AuthRemoteDataSource dataSource;

  WatchAuthStateUseCase(this.dataSource);

  @override
  Future<Result<Stream<UserEntity?>>> call() async {
    return Success(dataSource.authState);
  }
}

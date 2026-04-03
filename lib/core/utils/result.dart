import 'package:equatable/equatable.dart';
import '../errors/app_error.dart';

/// Functional Result type for error handling
/// Usage: final result = await someOperation();
/// switch (result) {
///   case Success(data: final value): // use value
///   case Failure(error: final error): // handle error
/// }
sealed class Result<T> extends Equatable {
  const Result();

  @override
  List<Object?> get props => [];

  /// Map success value to another type
  Result<R> map<R>(R Function(T value) transform) {
    return when(
      success: (data) => Success<R>(transform(data)),
      failure: (error) => Failure<R>(error),
    );
  }

  /// Async map success value
  Future<Result<R>> mapAsync<R>(Future<R> Function(T value) transform) async {
    return when(
      success: (data) async => Success<R>(await transform(data)),
      failure: (error) async => Failure<R>(error),
    );
  }

  /// Handle both cases without returning value
  R when<R>({
    required R Function(T data) success,
    required R Function(AppError error) failure,
  });

  /// Get value or null
  T? get valueOrNull {
    return when(
      success: (data) => data,
      failure: (_) => null,
    );
  }

  /// Get error or null
  AppError? get errorOrNull {
    return when(
      success: (_) => null,
      failure: (error) => error,
    );
  }

  /// Check if success
  bool get isSuccess => this is Success<T>;

  /// Check if failure
  bool get isFailure => this is Failure<T>;
}

/// Success case
class Success<T> extends Result<T> {
  final T data;

  const Success(this.data);

  @override
  R when<R>({
    required R Function(T data) success,
    required R Function(AppError error) failure,
  }) {
    return success(data);
  }

  @override
  List<Object?> get props => [data];
}

/// Failure case
class Failure<T> extends Result<T> {
  final AppError error;

  const Failure(this.error);

  @override
  R when<R>({
    required R Function(T data) success,
    required R Function(AppError error) failure,
  }) {
    return failure(error);
  }

  @override
  List<Object?> get props => [error];
}

/// Extension for easier creation
extension ResultExtension<T> on T {
  /// Wrap value in Success
  Result<T> get asSuccess => Success(this);
}

/// Extension for easier error creation
extension AppErrorExtension on AppError {
  /// Wrap error in Failure
  Result<T> asFailure<T>() => Failure(this);
}

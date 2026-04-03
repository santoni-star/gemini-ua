import 'package:equatable/equatable.dart';

/// Base class for all application errors
sealed class AppError extends Equatable {
  final String message;
  final StackTrace? stackTrace;

  const AppError({
    required this.message,
    this.stackTrace,
  });

  @override
  List<Object?> get props => [message, stackTrace];
}

/// Authentication errors
class AuthError extends AppError {
  final AuthErrorCode code;

  const AuthError({
    required this.code,
    required super.message,
    super.stackTrace,
  });

  @override
  List<Object?> get props => [code, message, stackTrace];
}

enum AuthErrorCode {
  invalidCredentials,
  userNotFound,
  userAlreadyExists,
  weakPassword,
  invalidEmail,
  sessionExpired,
  unauthorized,
  unknown,
}

/// Network errors
class NetworkError extends AppError {
  final NetworkErrorCode code;

  const NetworkError({
    required this.code,
    required super.message,
    super.stackTrace,
  });

  @override
  List<Object?> get props => [code, message, stackTrace];
}

enum NetworkErrorCode {
  noConnection,
  timeout,
  serverError,
  badRequest,
  notFound,
  unknown,
}

/// Validation errors
class ValidationError extends AppError {
  final Map<String, String> fields;

  const ValidationError({
    required this.fields,
    required super.message,
    super.stackTrace,
  });

  @override
  List<Object?> get props => [fields, message, stackTrace];
}

/// Database errors
class DatabaseError extends AppError {
  const DatabaseError({
    required super.message,
    super.stackTrace,
  });
}

/// Permission errors
class PermissionError extends AppError {
  const PermissionError({
    required super.message,
    super.stackTrace,
  });
}

/// Feature not available error (for feature flags)
class FeatureNotAvailableError extends AppError {
  final String featureName;
  final String requiredPlan;

  const FeatureNotAvailableError({
    required this.featureName,
    required this.requiredPlan,
    super.message = 'This feature is not available in your current plan',
    super.stackTrace,
  });

  @override
  List<Object?> get props => [featureName, requiredPlan, message, stackTrace];
}

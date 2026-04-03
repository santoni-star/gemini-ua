import '../utils/result.dart';

/// Base repository interface for all repositories
/// Implements common CRUD operations with Result type
abstract class BaseRepository<T, ID> {
  /// Get all entities with optional filters
  Future<Result<List<T>>> getAll({Map<String, dynamic>? filters});

  /// Get entity by ID
  Future<Result<T>> getById(ID id);

  /// Create new entity
  Future<Result<T>> create(T entity);

  /// Update existing entity
  Future<Result<T>> update(ID id, T entity);

  /// Delete entity
  Future<Result<void>> delete(ID id);

  /// Watch for realtime changes
  Stream<List<T>> watch({Map<String, dynamic>? filters});
}

/// Base use case interface
/// Each use case should implement call method
abstract class BaseUseCase<ReturnType, Params> {
  Future<Result<ReturnType>> call(Params params);
}

/// Use case without parameters
abstract class BaseUseCaseNoParams<ReturnType> {
  Future<Result<ReturnType>> call();
}

/// No parameters marker
class NoParams {
  const NoParams();
  
  static const instance = NoParams();
}

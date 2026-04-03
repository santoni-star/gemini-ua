import 'package:isar/isar.dart';
import '../utils/result.dart';
import '../utils/base_repository.dart';

/// Sync status for offline-first repositories
enum SyncStatus {
  synced,
  syncing,
  pending,
  error,
}

/// Abstract repository for offline-first features
/// Extends BaseRepository with sync capabilities
abstract class SyncableRepository<T, ID> extends BaseRepository<T, ID> {
  /// Sync pending changes to server
  Future<Result<void>> syncPendingChanges();

  /// Sync status stream
  Stream<SyncStatus> get syncStatus;

  /// Save entity locally (offline)
  Future<Result<void>> saveLocally(T entity);

  /// Get local cache
  Future<Result<List<T>>> getLocalCache();

  /// Clear local cache
  Future<Result<void>> clearLocalCache();
}

/// Isar collection names
class IsarCollections {
  static const String shifts = 'shifts';
  static const String messages = 'messages';
  static const String users = 'users';
  static const String companies = 'companies';
}

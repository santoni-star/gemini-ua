import '../../../../core/utils/base_repository.dart';
import '../../../../core/utils/result.dart';
import '../entities/shift_entity.dart';

/// Shift repository interface (domain layer)
abstract class ShiftRepository extends BaseRepository<ShiftEntity, String> {
  /// Get shifts for current user's company
  @override
  Future<Result<List<ShiftEntity>>> getAll({Map<String, dynamic>? filters});

  /// Get shifts by date range
  Future<Result<List<ShiftEntity>>> getByDateRange({
    required DateTime startDate,
    required DateTime endDate,
  });

  /// Get user's assignments
  Future<Result<List<ShiftAssignmentEntity>>> getUserAssignments(String userId);

  /// Assign user to shift
  Future<Result<ShiftAssignmentEntity>> assignUser({
    required String shiftId,
    required String userId,
  });

  /// Update assignment status
  Future<Result<ShiftAssignmentEntity>> updateAssignmentStatus({
    required String assignmentId,
    required AssignmentStatus status,
  });

  /// Watch shifts realtime
  @override
  Stream<List<ShiftEntity>> watch({Map<String, dynamic>? filters});
}

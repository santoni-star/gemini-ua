import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/shift_entity.dart';
import '../../domain/repositories/shift_repository.dart';
import '../datasources/shift_remote_datasource.dart';

/// Shift repository implementation
class ShiftRepositoryImpl implements ShiftRepository {
  final ShiftRemoteDataSource dataSource;

  ShiftRepositoryImpl(this.dataSource);

  @override
  Future<Result<List<ShiftEntity>>> getAll({Map<String, dynamic>? filters}) async {
    try {
      final shifts = await dataSource.getShifts(filters: filters);
      return Success(shifts);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<ShiftEntity>> getById(String id) async {
    try {
      final shift = await dataSource.getShiftById(id);
      return Success(shift);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<ShiftEntity>> create(ShiftEntity entity) async {
    try {
      final shift = await dataSource.createShift(entity);
      return Success(shift);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<ShiftEntity>> update(String id, ShiftEntity entity) async {
    try {
      final shift = await dataSource.updateShift(id, entity);
      return Success(shift);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<void>> delete(String id) async {
    try {
      await dataSource.deleteShift(id);
      return const Success(null);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<List<ShiftEntity>>> getByDateRange({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final shifts = await dataSource.getShiftsByDateRange(
        startDate: startDate,
        endDate: endDate,
      );
      return Success(shifts);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<List<ShiftAssignmentEntity>>> getUserAssignments(
    String userId,
  ) async {
    try {
      final assignments = await dataSource.getUserAssignments(userId);
      return Success(assignments);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<ShiftAssignmentEntity>> assignUser({
    required String shiftId,
    required String userId,
  }) async {
    try {
      final assignment = await dataSource.assignUser(
        shiftId: shiftId,
        userId: userId,
      );
      return Success(assignment);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<ShiftAssignmentEntity>> updateAssignmentStatus({
    required String assignmentId,
    required AssignmentStatus status,
  }) async {
    try {
      final assignment = await dataSource.updateAssignmentStatus(
        assignmentId: assignmentId,
        status: status,
      );
      return Success(assignment);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Stream<List<ShiftEntity>> watch({Map<String, dynamic>? filters}) {
    return dataSource.watchShifts(filters: filters);
  }
}

import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../domain/entities/shift_entity.dart';
import '../models/shift_model.dart';

/// Shift remote data source interface
abstract class ShiftRemoteDataSource {
  /// Get all shifts for company
  Future<List<ShiftEntity>> getShifts({Map<String, dynamic>? filters});

  /// Get shift by ID
  Future<ShiftEntity> getShiftById(String id);

  /// Create new shift
  Future<ShiftEntity> createShift(ShiftEntity shift);

  /// Update shift
  Future<ShiftEntity> updateShift(String id, ShiftEntity shift);

  /// Delete shift
  Future<void> deleteShift(String id);

  /// Get shifts by date range
  Future<List<ShiftEntity>> getShiftsByDateRange({
    required DateTime startDate,
    required DateTime endDate,
  });

  /// Get user assignments
  Future<List<ShiftAssignmentEntity>> getUserAssignments(String userId);

  /// Assign user to shift
  Future<ShiftAssignmentEntity> assignUser({
    required String shiftId,
    required String userId,
  });

  /// Update assignment status
  Future<ShiftAssignmentEntity> updateAssignmentStatus({
    required String assignmentId,
    required AssignmentStatus status,
  });

  /// Watch shifts realtime
  Stream<List<ShiftEntity>> watchShifts({Map<String, dynamic>? filters});
}

/// Supabase implementation
class ShiftRemoteDataSourceImpl implements ShiftRemoteDataSource {
  final DatabaseClient client;

  ShiftRemoteDataSourceImpl(this.client);

  @override
  Future<List<ShiftEntity>> getShifts({Map<String, dynamic>? filters}) async {
    final data = await client.select('shifts', match: filters);
    return data
        .map((json) => ShiftModel.fromJson(json as Map<String, dynamic>).toEntity())
        .toList();
  }

  @override
  Future<ShiftEntity> getShiftById(String id) async {
    final data = await client.select('shifts', match: {'id': id});
    if (data.isEmpty) {
      throw const DatabaseError(message: 'Shift not found');
    }
    return ShiftModel.fromJson(data.first as Map<String, dynamic>).toEntity();
  }

  @override
  Future<ShiftEntity> createShift(ShiftEntity shift) async {
    final model = shiftModelFromEntity(shift);
    final json = model.toJson();
    final data = await client.insert('shifts', json);
    return ShiftModel.fromJson(data as Map<String, dynamic>).toEntity();
  }

  @override
  Future<ShiftEntity> updateShift(String id, ShiftEntity shift) async {
    final model = shiftModelFromEntity(shift);
    final json = model.toJson()..remove('id')..remove('created_at');
    await client.update('shifts', json, id);
    return getShiftById(id);
  }

  @override
  Future<void> deleteShift(String id) async {
    await client.delete('shifts', id);
  }

  @override
  Future<List<ShiftEntity>> getShiftsByDateRange({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    // Note: In real implementation, use gte/lte filters
    final data = await client.select('shifts');
    return data
        .where((item) {
          final startTime = DateTime.parse(item['start_time'] as String);
          return startTime.isAfter(startDate) && startTime.isBefore(endDate);
        })
        .map((json) => ShiftModel.fromJson(json as Map<String, dynamic>).toEntity())
        .toList();
  }

  @override
  Future<List<ShiftAssignmentEntity>> getUserAssignments(String userId) async {
    final data = await client.select('shift_assignments', match: {'user_id': userId});
    return data
        .map((json) => ShiftAssignmentModel.fromJson(json as Map<String, dynamic>).toEntity())
        .toList();
  }

  @override
  Future<ShiftAssignmentEntity> assignUser({
    required String shiftId,
    required String userId,
  }) async {
    final json = {
      'shift_id': shiftId,
      'user_id': userId,
      'status': 'pending',
    };
    final data = await client.insert('shift_assignments', json);
    return ShiftAssignmentModel.fromJson(data as Map<String, dynamic>).toEntity();
  }

  @override
  Future<ShiftAssignmentEntity> updateAssignmentStatus({
    required String assignmentId,
    required AssignmentStatus status,
  }) async {
    await client.update('shift_assignments', {'status': status.name}, assignmentId);
    final data = await client.select(
      'shift_assignments',
      match: {'id': assignmentId},
    );
    return ShiftAssignmentModel.fromJson(data.first as Map<String, dynamic>).toEntity();
  }

  @override
  Stream<List<ShiftEntity>> watchShifts({Map<String, dynamic>? filters}) {
    return client.stream('shifts', primaryKey: 'id', filters: filters).map((data) {
      return data
          .map((json) => ShiftModel.fromJson(json as Map<String, dynamic>).toEntity())
          .toList();
    });
  }
}

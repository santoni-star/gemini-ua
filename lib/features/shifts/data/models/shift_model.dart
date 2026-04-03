import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/shift_entity.dart';

part 'shift_model.freezed.dart';
part 'shift_model.g.dart';

/// Shift model for JSON serialization
@freezed
class ShiftModel with _$ShiftModel {
  const factory ShiftModel({
    required String id,
    required String companyId,
    required String title,
    String? description,
    required DateTime startTime,
    required DateTime endTime,
    String? location,
    required String status,
    required String createdBy,
    required DateTime createdAt,
    DateTime? updatedAt,
  }) = _ShiftModel;

  factory ShiftModel.fromJson(Map<String, dynamic> json) =>
      _$ShiftModelFromJson(json);
}

/// Shift assignment model
@freezed
class ShiftAssignmentModel with _$ShiftAssignmentModel {
  const factory ShiftAssignmentModel({
    required String id,
    required String shiftId,
    required String userId,
    required String status,
    required DateTime assignedAt,
  }) = _ShiftAssignmentModel;

  factory ShiftAssignmentModel.fromJson(Map<String, dynamic> json) =>
      _$ShiftAssignmentModelFromJson(json);
}

/// Extension methods for ShiftModel
extension ShiftModelMapper on ShiftModel {
  /// Convert to domain entity
  ShiftEntity toEntity() {
    return ShiftEntity(
      id: id,
      companyId: companyId,
      title: title,
      description: description,
      startTime: startTime,
      endTime: endTime,
      location: location,
      status: ShiftStatus.values.firstWhere(
        (e) => e.name == status,
        orElse: () => ShiftStatus.scheduled,
      ),
      createdBy: createdBy,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}

/// Create ShiftModel from entity
ShiftModel shiftModelFromEntity(ShiftEntity entity) {
  return ShiftModel(
    id: entity.id,
    companyId: entity.companyId,
    title: entity.title,
    description: entity.description,
    startTime: entity.startTime,
    endTime: entity.endTime,
    location: entity.location,
    status: entity.status.name,
    createdBy: entity.createdBy,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  );
}

/// Extension methods for ShiftAssignmentModel
extension ShiftAssignmentModelMapper on ShiftAssignmentModel {
  /// Convert to domain entity
  ShiftAssignmentEntity toEntity() {
    return ShiftAssignmentEntity(
      id: id,
      shiftId: shiftId,
      userId: userId,
      status: AssignmentStatus.values.firstWhere(
        (e) => e.name == status,
        orElse: () => AssignmentStatus.pending,
      ),
      assignedAt: assignedAt,
    );
  }
}

/// Create ShiftAssignmentModel from entity
ShiftAssignmentModel shiftAssignmentModelFromEntity(ShiftAssignmentEntity entity) {
  return ShiftAssignmentModel(
    id: entity.id,
    shiftId: entity.shiftId,
    userId: entity.userId,
    status: entity.status.name,
    assignedAt: entity.assignedAt,
  );
}

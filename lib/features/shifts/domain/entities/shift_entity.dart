import 'package:equatable/equatable.dart';
import '../../../../core/config/feature_flags.dart';

/// Shift entity (domain layer)
class ShiftEntity extends Equatable {
  final String id;
  final String companyId;
  final String title;
  final String? description;
  final DateTime startTime;
  final DateTime endTime;
  final String? location;
  final ShiftStatus status;
  final String createdBy;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const ShiftEntity({
    required this.id,
    required this.companyId,
    required this.title,
    this.description,
    required this.startTime,
    required this.endTime,
    this.location,
    this.status = ShiftStatus.scheduled,
    required this.createdBy,
    required this.createdAt,
    this.updatedAt,
  });

  /// Check if shift is active now
  bool get isActive {
    final now = DateTime.now();
    return now.isAfter(startTime) && now.isBefore(endTime);
  }

  /// Check if shift is in the future
  bool get isUpcoming => startTime.isAfter(DateTime.now());

  /// Get shift duration in hours
  double get durationInHours {
    return endTime.difference(startTime).inMinutes / 60;
  }

  @override
  List<Object?> get props => [
        id,
        companyId,
        title,
        description,
        startTime,
        endTime,
        location,
        status,
        createdBy,
        createdAt,
        updatedAt,
      ];

  ShiftEntity copyWith({
    String? id,
    String? companyId,
    String? title,
    String? description,
    DateTime? startTime,
    DateTime? endTime,
    String? location,
    ShiftStatus? status,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ShiftEntity(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      title: title ?? this.title,
      description: description ?? this.description,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      location: location ?? this.location,
      status: status ?? this.status,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// Shift status enum
enum ShiftStatus {
  scheduled,
  confirmed,
  inProgress,
  completed,
  cancelled,
}

/// Assignment status enum
enum AssignmentStatus {
  pending,
  accepted,
  declined,
}

/// Shift assignment entity
class ShiftAssignmentEntity extends Equatable {
  final String id;
  final String shiftId;
  final String userId;
  final AssignmentStatus status;
  final DateTime assignedAt;

  const ShiftAssignmentEntity({
    required this.id,
    required this.shiftId,
    required this.userId,
    this.status = AssignmentStatus.pending,
    required this.assignedAt,
  });

  @override
  List<Object?> get props => [id, shiftId, userId, status, assignedAt];
}

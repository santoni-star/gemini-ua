import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/di/providers.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../../../core/errors/app_error.dart';
import '../../data/datasources/shift_remote_datasource.dart';
import '../../data/repositories/shift_repository_impl.dart';
import '../../domain/repositories/shift_repository.dart';
import '../../domain/entities/shift_entity.dart';

part 'shifts_provider.g.dart';

/// Shift data source provider
final shiftDataSourceProvider = Provider<ShiftRemoteDataSource>((ref) {
  return ShiftRemoteDataSourceImpl(ref.watch(databaseClientProvider));
});

/// Shift repository provider
final shiftRepositoryProvider = Provider<ShiftRepository>((ref) {
  return ShiftRepositoryImpl(ref.watch(shiftDataSourceProvider));
});

/// Watch shifts stream provider
@riverpod
Stream<List<ShiftEntity>> shiftsStream(ShiftsStreamRef ref) {
  final repository = ref.watch(shiftRepositoryProvider);
  return repository.watch();
}

/// Shift form state
class ShiftFormState {
  final String? title;
  final String? description;
  final DateTime? startTime;
  final DateTime? endTime;
  final String? location;
  final bool isLoading;
  final String? error;

  const ShiftFormState({
    this.title,
    this.description,
    this.startTime,
    this.endTime,
    this.location,
    this.isLoading = false,
    this.error,
  });

  factory ShiftFormState.initial() {
    return const ShiftFormState(
      title: null,
      description: null,
      startTime: null,
      endTime: null,
      location: null,
      isLoading: false,
      error: null,
    );
  }

  ShiftFormState copyWith({
    String? title,
    String? description,
    DateTime? startTime,
    DateTime? endTime,
    String? location,
    bool? isLoading,
    String? error,
  }) {
    return ShiftFormState(
      title: title ?? this.title,
      description: description ?? this.description,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      location: location ?? this.location,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }

  bool get isValid =>
      title != null &&
      title!.isNotEmpty &&
      startTime != null &&
      endTime != null &&
      endTime!.isAfter(startTime!);
}

/// Shift form notifier
@riverpod
class ShiftFormNotifier extends _$ShiftFormNotifier {
  @override
  ShiftFormState build() => ShiftFormState.initial();

  void setTitle(String title) {
    state = state.copyWith(title: title);
  }

  void setDescription(String description) {
    state = state.copyWith(description: description);
  }

  void setStartTime(DateTime time) {
    state = state.copyWith(startTime: time);
  }

  void setEndTime(DateTime time) {
    state = state.copyWith(endTime: time);
  }

  void setLocation(String location) {
    state = state.copyWith(location: location);
  }

  Future<bool> submit() async {
    if (!state.isValid) {
      state = state.copyWith(error: 'Please fill all required fields');
      return false;
    }

    state = state.copyWith(isLoading: true, error: null);

    // In real implementation, call use case
    // final result = await ref.read(createShiftUseCaseProvider).call(...);

    await Future.delayed(const Duration(seconds: 1)); // Simulate API call

    state = state.copyWith(isLoading: false);
    return true;
  }

  void reset() {
    state = ShiftFormState.initial();
  }
}

/// Selected shift provider
final selectedShiftProvider = StateProvider<ShiftEntity?>((ref) => null);

/// Date range filter provider
final shiftDateRangeProvider = StateProvider<DateTimeRange>((ref) {
  final now = DateTime.now();
  return DateTimeRange(
    start: DateTime(now.year, now.month, 1),
    end: DateTime(now.year, now.month + 1, 0),
  );
});

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:intl/intl.dart';
import '../../../../core/config/feature_flags.dart';
import '../../domain/entities/shift_entity.dart';
import '../providers/shifts_provider.dart';

/// Shifts list screen
class ShiftsScreen extends ConsumerWidget {
  const ShiftsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final shiftsAsync = ref.watch(shiftsStreamProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Shifts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () => _showDateRangePicker(context, ref),
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _navigateToCreateShift(context),
          ),
        ],
      ),
      body: shiftsAsync.when(
        data: (shifts) {
          if (shifts.isEmpty) {
            return _buildEmptyState(context);
          }

          // Group shifts by date
          final groupedShifts = _groupShiftsByDate(shifts);

          return ListView.builder(
            padding: EdgeInsets.all(16.w),
            itemCount: groupedShifts.length,
            itemBuilder: (context, index) {
              final date = groupedShifts.keys.elementAt(index);
              final dayShifts = groupedShifts[date]!;

              return _buildDateSection(context, date, dayShifts, ref);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => _buildErrorState(context, error.toString()),
      ),
    );
  }

  Map<DateTime, List<ShiftEntity>> _groupShiftsByDate(List<ShiftEntity> shifts) {
    final grouped = <DateTime, List<ShiftEntity>>{};

    for (final shift in shifts) {
      final date = DateTime(
        shift.startTime.year,
        shift.startTime.month,
        shift.startTime.day,
      );

      grouped.putIfAbsent(date, () => []).add(shift);
    }

    // Sort dates
    final sorted = Map.fromEntries(
      grouped.entries.toList()..sort((a, b) => a.key.compareTo(b.key)),
    );

    return sorted;
  }

  Widget _buildDateSection(
    BuildContext context,
    DateTime date,
    List<ShiftEntity> shifts,
    WidgetRef ref,
  ) {
    final isToday = DateTime.now().day == date.day &&
        DateTime.now().month == date.month &&
        DateTime.now().year == date.year;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Date header
        Padding(
          padding: EdgeInsets.only(bottom: 8.h),
          child: Row(
            children: [
              Text(
                isToday ? 'Today' : DateFormat('EEEE, MMM d').format(date),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              Gap(8.w),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Text(
                  '${shifts.length}',
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Shifts list
        ...shifts.map((shift) => _buildShiftCard(context, shift, ref)),

        Gap(16.h),
      ],
    );
  }

  Widget _buildShiftCard(
    BuildContext context,
    ShiftEntity shift,
    WidgetRef ref,
  ) {
    final timeFormat = DateFormat('HH:mm');

    return Card(
      margin: EdgeInsets.only(bottom: 12.h),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: InkWell(
        onTap: () => _navigateToShiftDetails(context, shift, ref),
        borderRadius: BorderRadius.circular(12.r),
        child: Padding(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title and status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      shift.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  _buildStatusChip(shift.status),
                ],
              ),
              Gap(8.h),

              // Time
              Row(
                children: [
                  Icon(Icons.access_time, size: 16.sp, color: Colors.grey[600]),
                  Gap(4.w),
                  Text(
                    '${timeFormat.format(shift.startTime)} - ${timeFormat.format(shift.endTime)}',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
              Gap(4.h),

              // Location (if available)
              if (shift.location != null) ...[
                Row(
                  children: [
                    Icon(Icons.location_on_outlined,
                        size: 16.sp, color: Colors.grey[600]),
                    Gap(4.w),
                    Expanded(
                      child: Text(
                        shift.location!,
                        style: TextStyle(color: Colors.grey[600]),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],

              // Description (if available)
              if (shift.description != null && shift.description!.isNotEmpty) ...[
                Gap(8.h),
                Text(
                  shift.description!,
                  style: TextStyle(color: Colors.grey[600], fontSize: 14.sp),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(ShiftStatus status) {
    Color color;
    String label;

    switch (status) {
      case ShiftStatus.scheduled:
        color = Colors.blue;
        label = 'Scheduled';
        break;
      case ShiftStatus.confirmed:
        color = Colors.green;
        label = 'Confirmed';
        break;
      case ShiftStatus.inProgress:
        color = Colors.orange;
        label = 'In Progress';
        break;
      case ShiftStatus.completed:
        color = Colors.grey;
        label = 'Completed';
        break;
      case ShiftStatus.cancelled:
        color = Colors.red;
        label = 'Cancelled';
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12.sp,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.event_busy,
            size: 80.sp,
            color: Colors.grey[400],
          ),
          Gap(24.h),
          Text(
            'No shifts scheduled',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          Gap(8.h),
          Text(
            'Tap + to create a new shift',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 60.sp,
            color: Colors.red[400],
          ),
          Gap(16.h),
          Text(
            'Failed to load shifts',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          Gap(8.h),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 32.w),
            child: Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
        ],
      ),
    );
  }

  void _showDateRangePicker(BuildContext context, WidgetRef ref) {
    // Implement date range picker
  }

  void _navigateToCreateShift(BuildContext context) {
    // Navigate to create shift screen
  }

  void _navigateToShiftDetails(
    BuildContext context,
    ShiftEntity shift,
    WidgetRef ref,
  ) {
    ref.read(selectedShiftProvider.notifier).state = shift;
    // Navigate to details screen
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import '../../../../core/config/feature_flags.dart';
import '../providers/billing_provider.dart';

/// Billing/Subscription screen
class BillingScreen extends ConsumerWidget {
  const BillingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final companyAsync = ref.watch(currentCompanyProvider);
    final employeeCountAsync = ref.watch(employeeCountProvider);
    final monthlyPriceAsync = ref.watch(monthlyPriceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription'),
      ),
      body: companyAsync.when(
        data: (company) {
          if (company == null) {
            return const Center(child: Text('No company found'));
          }

          return SingleChildScrollView(
            padding: EdgeInsets.all(16.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Current plan card
                _buildCurrentPlanCard(context, company),
                Gap(24.h),

                // Employee count and price
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        context,
                        'Employees',
                        '${employeeCountAsync.value ?? 0}',
                        Icons.people_outline,
                      ),
                    ),
                    Gap(16.w),
                    Expanded(
                      child: _buildStatCard(
                        context,
                        'Monthly Price',
                        '${monthlyPriceAsync.value?.toStringAsFixed(2) ?? "0.00"} zł',
                        Icons.account_balance_wallet,
                      ),
                    ),
                  ],
                ),
                Gap(24.h),

                // Plan comparison
                Text(
                  'Available Plans',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                Gap(16.h),

                // Starter plan
                _buildPlanCard(
                  context,
                  ref,
                  PlanTier.starter,
                  company.planTier == PlanTier.starter,
                ),
                Gap(12.h),

                // Growth plan
                _buildPlanCard(
                  context,
                  ref,
                  PlanTier.growth,
                  company.planTier == PlanTier.growth,
                ),
                Gap(12.h),

                // Enterprise plan
                _buildPlanCard(
                  context,
                  ref,
                  PlanTier.enterprise,
                  company.planTier == PlanTier.enterprise,
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _buildCurrentPlanCard(BuildContext context, CompanyEntity company) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Container(
        padding: EdgeInsets.all(24.w),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Theme.of(context).primaryColor,
              Theme.of(context).primaryColor.withOpacity(0.7),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16.r),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Current Plan',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14.sp,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20.r),
                  ),
                  child: Text(
                    company.planTier.name.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            Gap(12.h),
            Text(
              _getPlanDisplayName(company.planTier),
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Gap(8.h),
            Text(
              _getPlanDescription(company.planTier),
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 14.sp,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String label,
    String value,
    IconData icon,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.grey[600], size: 24.sp),
            Gap(8.h),
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12.sp,
              ),
            ),
            Gap(4.h),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(
    BuildContext context,
    WidgetRef ref,
    PlanTier tier,
    bool isCurrent,
  ) {
    final plan = CompanyPlan.fromTier(tier);
    final isUpgrade = _isUpgrade(tier, ref);

    return Card(
      elevation: isCurrent ? 4 : 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.r),
        side: BorderSide(
          color: isCurrent
              ? Theme.of(context).primaryColor
              : Colors.grey[300]!,
          width: isCurrent ? 2 : 1,
        ),
      ),
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getPlanDisplayName(tier),
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Gap(4.h),
                    Text(
                      '${plan.basePrice} zł/month',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 16.sp,
                      ),
                    ),
                  ],
                ),
                if (isCurrent)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(8.r),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.check_circle, color: Colors.green[700], size: 14.sp),
                        Gap(4.w),
                        Text(
                          'Current',
                          style: TextStyle(
                            color: Colors.green[700],
                            fontSize: 12.sp,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            Gap(12.h),
            Divider(height: 1),
            Gap(12.h),
            // Features
            ...plan.enabledFeatures.map((feature) => Padding(
                  padding: EdgeInsets.only(bottom: 8.h),
                  child: Row(
                    children: [
                      Icon(
                        Icons.check_circle_outline,
                        size: 16.sp,
                        color: Colors.green[600],
                      ),
                      Gap(8.w),
                      Text(
                        _getFeatureName(feature),
                        style: TextStyle(fontSize: 14.sp),
                      ),
                    ],
                  ),
                )),
            Gap(12.h),
            // Upgrade button
            if (!isCurrent)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: isUpgrade
                      ? () => _confirmUpgrade(context, ref, tier)
                      : null,
                  style: OutlinedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 12.h),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.r),
                    ),
                  ),
                  child: Text(isUpgrade ? 'Upgrade to ${_getPlanDisplayName(tier)}' : 'Downgrade not available'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  bool _isUpgrade(PlanTier tier, WidgetRef ref) {
    final company = ref.read(currentCompanyProvider);
    if (company.hasValue && company.value != null) {
      final tiers = [PlanTier.starter, PlanTier.growth, PlanTier.enterprise];
      return tiers.indexOf(tier) > tiers.indexOf(company.value!.planTier);
    }
    return false;
  }

  void _confirmUpgrade(BuildContext context, WidgetRef ref, PlanTier tier) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Upgrade Plan'),
        content: Text(
          'Are you sure you want to upgrade to ${_getPlanDisplayName(tier)}? '
          'Your billing will be updated.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              final success = await ref
                  .read(planUpgradeNotifierProvider.notifier)
                  .upgradeTo(tier);

              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success ? 'Plan upgraded successfully!' : 'Failed to upgrade plan',
                    ),
                    backgroundColor: success ? Colors.green : Colors.red,
                  ),
                );
              }
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  String _getPlanDisplayName(PlanTier tier) {
    switch (tier) {
      case PlanTier.starter:
        return 'Starter';
      case PlanTier.growth:
        return 'Growth';
      case PlanTier.enterprise:
        return 'Enterprise';
    }
  }

  String _getPlanDescription(PlanTier tier) {
    switch (tier) {
      case PlanTier.starter:
        return 'Up to 50 employees - ${CompanyPlan.starter.basePrice} zł/month';
      case PlanTier.growth:
        return 'Up to 50 + 4.99 zł/employee - ${CompanyPlan.growth.basePrice} zł base';
      case PlanTier.enterprise:
        return 'Up to 300 + 2.99 zł/employee - ${CompanyPlan.enterprise.basePrice} zł base';
    }
  }

  String _getFeatureName(AppFeature feature) {
    switch (feature) {
      case AppFeature.auth:
        return 'Authentication';
      case AppFeature.profile:
        return 'User Profiles';
      case AppFeature.notifications:
        return 'Notifications';
      case AppFeature.chat:
        return 'Team Chat';
      case AppFeature.shifts:
        return 'Shift Management';
      case AppFeature.polls:
        return 'Polls';
      case AppFeature.calls:
        return 'Voice Calls';
      case AppFeature.payroll:
        return 'Payroll';
      case AppFeature.tasks:
        return 'Task Management';
      case AppFeature.analytics:
        return 'Analytics';
      case AppFeature.auditLog:
        return 'Audit Logs';
      case AppFeature.endToEndEncryption:
        return 'End-to-End Encryption';
    }
  }
}

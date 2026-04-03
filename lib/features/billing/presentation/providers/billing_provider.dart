import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/di/providers.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../data/datasources/billing_remote_datasource.dart';
import '../../data/repositories/billing_repository_impl.dart';
import '../../domain/repositories/billing_repository.dart';
import '../entities/company_entity.dart';

part 'billing_provider.g.dart';

/// Billing data source provider
final billingDataSourceProvider = Provider<BillingRemoteDataSource>((ref) {
  return BillingRemoteDataSourceImpl(ref.watch(databaseClientProvider));
});

/// Billing repository provider
final billingRepositoryProvider = Provider<BillingRepository>((ref) {
  return BillingRepositoryImpl(ref.watch(billingDataSourceProvider));
});

/// Current company provider
final currentCompanyProvider = FutureProvider<CompanyEntity?>((ref) async {
  final repository = ref.watch(billingRepositoryProvider);
  final result = await repository.getCurrentCompany();
  return result.valueOrNull;
});

/// Employee count provider
final employeeCountProvider = FutureProvider<int>((ref) async {
  final repository = ref.watch(billingRepositoryProvider);
  final result = await repository.getEmployeeCount();
  return result.valueOrNull ?? 0;
});

/// Monthly price provider
final monthlyPriceProvider = FutureProvider<double>((ref) async {
  final repository = ref.watch(billingRepositoryProvider);
  final result = await repository.calculatePrice();
  return result.valueOrNull ?? 0.0;
});

/// Feature access checker
final featureAccessProvider = Provider<FeatureAccessChecker>((ref) {
  return FeatureAccessChecker(ref);
});

/// Feature access checker helper
class FeatureAccessChecker {
  final Ref _ref;

  FeatureAccessChecker(this._ref);

  /// Check if feature is available
  bool canAccess(AppFeature feature) {
    final company = _ref.read(currentCompanyProvider);
    if (company.hasValue && company.value != null) {
      return company.value!.hasFeature(feature);
    }
    return false;
  }

  /// Get required plan for feature
  PlanTier? getRequiredPlan(AppFeature feature) {
    final company = _ref.read(currentCompanyProvider);
    if (company.hasValue && company.value != null) {
      return company.value!.getRequiredPlanForFeature(feature);
    }
    return null;
  }
}

/// Billing state for UI
class BillingState {
  final CompanyEntity? company;
  final int employeeCount;
  final double monthlyPrice;
  final bool isLoading;

  const BillingState({
    this.company,
    this.employeeCount = 0,
    this.monthlyPrice = 0.0,
    this.isLoading = false,
  });

  BillingState copyWith({
    CompanyEntity? company,
    int? employeeCount,
    double? monthlyPrice,
    bool? isLoading,
  }) {
    return BillingState(
      company: company ?? this.company,
      employeeCount: employeeCount ?? this.employeeCount,
      monthlyPrice: monthlyPrice ?? this.monthlyPrice,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

/// Plan upgrade notifier
@riverpod
class PlanUpgradeNotifier extends _$PlanUpgradeNotifier {
  @override
  Future<void> build() async => null;

  Future<bool> upgradeTo(PlanTier newTier) async {
    state = const AsyncLoading();

    try {
      final repository = ref.read(billingRepositoryProvider);
      final result = await repository.updatePlan(newTier);

      if (result.isFailure) {
        state = AsyncError(result.errorOrNull, StackTrace.current);
        return false;
      }

      // Refresh company data
      ref.invalidate(currentCompanyProvider);
      state = const AsyncData(null);
      return true;
    } catch (e, stack) {
      state = AsyncError(e, stack);
      return false;
    }
  }
}

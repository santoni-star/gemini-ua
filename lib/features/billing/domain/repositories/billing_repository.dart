import '../../../../core/utils/base_repository.dart';
import '../../../../core/utils/result.dart';
import '../../../../core/config/feature_flags.dart';
import '../entities/company_entity.dart';

/// Billing repository interface
abstract class BillingRepository {
  /// Get current company
  Future<Result<CompanyEntity>> getCurrentCompany();

  /// Update company plan
  Future<Result<CompanyEntity>> updatePlan(PlanTier newTier);

  /// Get employee count
  Future<Result<int>> getEmployeeCount();

  /// Calculate monthly price
  Future<Result<double>> calculatePrice();

  /// Get billing stats (for developer only)
  Future<Result<BillingStats>> getBillingStats();

  /// Watch company changes
  Stream<CompanyEntity?> watchCompany();
}

/// Billing statistics (aggregated, no sensitive data)
class BillingStats extends Equatable {
  final String companyId;
  final String companyName;
  final PlanTier planTier;
  final int employeeCount;
  final double monthlyPrice;
  final DateTime billingMonth;

  const BillingStats({
    required this.companyId,
    required this.companyName,
    required this.planTier,
    required this.employeeCount,
    required this.monthlyPrice,
    required this.billingMonth,
  });

  @override
  List<Object?> get props => [
        companyId,
        companyName,
        planTier,
        employeeCount,
        monthlyPrice,
        billingMonth,
      ];
}

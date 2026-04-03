import '../../../../core/config/feature_flags.dart';
import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/company_entity.dart';
import '../../domain/repositories/billing_repository.dart';
import '../datasources/billing_remote_datasource.dart';

/// Billing repository implementation
class BillingRepositoryImpl implements BillingRepository {
  final BillingRemoteDataSource dataSource;

  BillingRepositoryImpl(this.dataSource);

  @override
  Future<Result<CompanyEntity>> getCurrentCompany() async {
    try {
      final company = await dataSource.getCurrentCompany();
      return Success(company);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<CompanyEntity>> updatePlan(PlanTier newTier) async {
    try {
      final company = await getCurrentCompany();
      if (company.isFailure) {
        return Failure(const DatabaseError(message: 'Company not found'));
      }

      final updated = await dataSource.updatePlan(company.valueOrNull!.id, newTier);
      return Success(updated);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<int>> getEmployeeCount() async {
    try {
      final company = await getCurrentCompany();
      if (company.isFailure) {
        return Failure(const DatabaseError(message: 'Company not found'));
      }

      final count = await dataSource.getEmployeeCount(company.valueOrNull!.id);
      return Success(count);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<double>> calculatePrice() async {
    try {
      final companyResult = await getCurrentCompany();
      if (companyResult.isFailure) {
        return Failure(const DatabaseError(message: 'Company not found'));
      }

      final company = companyResult.valueOrNull!;
      final employeeCountResult = await getEmployeeCount();

      if (employeeCountResult.isFailure) {
        return Failure(const DatabaseError(message: 'Failed to get employee count'));
      }

      final employeeCount = employeeCountResult.valueOrNull!;
      final plan = CompanyPlan.fromTier(company.planTier);
      final price = plan.calculatePrice(employeeCount);

      return Success(price);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<BillingStats>> getBillingStats() async {
    try {
      final company = await getCurrentCompany();
      if (company.isFailure) {
        return Failure(const DatabaseError(message: 'Company not found'));
      }

      final stats = await dataSource.getBillingStats(company.valueOrNull!.id);
      return Success(stats);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Stream<CompanyEntity?> watchCompany() {
    // In real implementation, use Supabase realtime subscription
    // For now, return empty stream
    return Stream.empty();
  }
}

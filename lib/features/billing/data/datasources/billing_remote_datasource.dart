import '../../../../core/config/feature_flags.dart';
import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../entities/company_entity.dart';
import '../repositories/billing_repository.dart';

/// Billing remote data source
abstract class BillingRemoteDataSource {
  /// Get current company
  Future<CompanyEntity> getCurrentCompany();

  /// Update plan
  Future<CompanyEntity> updatePlan(String companyId, PlanTier newTier);

  /// Get employee count
  Future<int> getEmployeeCount(String companyId);

  /// Get billing stats
  Future<BillingStats> getBillingStats(String companyId);
}

/// Supabase implementation
class BillingRemoteDataSourceImpl implements BillingRemoteDataSource {
  final DatabaseClient client;

  BillingRemoteDataSourceImpl(this.client);

  @override
  Future<CompanyEntity> getCurrentCompany() async {
    // Get user's company ID from profiles
    // In real app, this comes from auth context
    final profiles = await client.select('profiles');
    if (profiles.isEmpty) {
      throw const DatabaseError(message: 'User profile not found');
    }

    final companyId = profiles.first['company_id'] as String;

    final companies = await client.select(
      'companies',
      match: {'id': companyId},
    );

    if (companies.isEmpty) {
      throw const DatabaseError(message: 'Company not found');
    }

    return _parseCompany(companies.first as Map<String, dynamic>);
  }

  @override
  Future<CompanyEntity> updatePlan(
    String companyId,
    PlanTier newTier,
  ) async {
    final plan = CompanyPlan.fromTier(newTier);

    await client.update('companies', {
      'plan_tier': newTier.name,
      'max_employees': plan.maxEmployees,
      'enabled_features': plan.enabledFeatures.map((e) => e.name).toList(),
    }, companyId);

    return getCurrentCompany();
  }

  @override
  Future<int> getEmployeeCount(String companyId) async {
    return await client.count(
      'profiles',
      filters: {'company_id': companyId, 'is_active': true},
    );
  }

  @override
  Future<BillingStats> getBillingStats(String companyId) async {
    // Use the billing_stats view (developer-only access)
    final stats = await client.select(
      'billing_stats',
      match: {'company_id': companyId},
    );

    if (stats.isEmpty) {
      throw const DatabaseError(message: 'Billing stats not found');
    }

    final data = stats.first as Map<String, dynamic>;
    return BillingStats(
      companyId: data['company_id'] as String,
      companyName: data['company_name'] as String,
      planTier: PlanTier.values.firstWhere(
        (e) => e.name == data['plan_tier'],
      ),
      employeeCount: data['employee_count'] as int? ?? 0,
      monthlyPrice: (data['monthly_price'] as num?)?.toDouble() ?? 0.0,
      billingMonth: DateTime.parse(data['billing_month'] as String),
    );
  }

  CompanyEntity _parseCompany(Map<String, dynamic> data) {
    final features = (data['enabled_features'] as List?)
            ?.map((e) => AppFeature.values.firstWhere(
                  (f) => f.name == e,
                  orElse: () => AppFeature.auth,
                ))
            .toSet() ??
        {};

    return CompanyEntity(
      id: data['id'] as String,
      name: data['name'] as String,
      code: data['code'] as String,
      planTier: PlanTier.values.firstWhere(
        (e) => e.name == data['plan_tier'],
      ),
      maxEmployees: data['max_employees'] as int? ?? 50,
      enabledFeatures: features,
      billingEmail: data['billing_email'] as String?,
      logoUrl: data['logo_url'] as String?,
      createdAt: DateTime.parse(data['created_at'] as String),
      updatedAt: DateTime.parse(data['updated_at'] as String),
    );
  }
}

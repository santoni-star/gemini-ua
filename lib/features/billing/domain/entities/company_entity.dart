import 'package:equatable/equatable.dart';
import '../../../../core/config/feature_flags.dart';

/// Company entity with billing info
class CompanyEntity extends Equatable {
  final String id;
  final String name;
  final String code;
  final PlanTier planTier;
  final int maxEmployees;
  final Set<AppFeature> enabledFeatures;
  final String? billingEmail;
  final String? logoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  const CompanyEntity({
    required this.id,
    required this.name,
    required this.code,
    this.planTier = PlanTier.starter,
    this.maxEmployees = 50,
    Set<AppFeature>? enabledFeatures,
    this.billingEmail,
    this.logoUrl,
    required this.createdAt,
    required this.updatedAt,
  }) : enabledFeatures = enabledFeatures ?? CompanyPlan.starter.enabledFeatures;

  /// Get current plan
  CompanyPlan get plan => CompanyPlan.fromTier(planTier);

  /// Check if feature is enabled
  bool hasFeature(AppFeature feature) => enabledFeatures.contains(feature);

  /// Check if upgrade is available
  bool canUpgrade(PlanTier targetTier) {
    final tiers = [PlanTier.starter, PlanTier.growth, PlanTier.enterprise];
    return tiers.indexOf(targetTier) > tiers.indexOf(planTier);
  }

  /// Get required plan for feature
  PlanTier? getRequiredPlanForFeature(AppFeature feature) {
    if (hasFeature(feature)) return null;

    if (CompanyPlan.starter.enabledFeatures.contains(feature)) {
      return PlanTier.starter;
    }
    if (CompanyPlan.growth.enabledFeatures.contains(feature)) {
      return PlanTier.growth;
    }
    if (CompanyPlan.enterprise.enabledFeatures.contains(feature)) {
      return PlanTier.enterprise;
    }
    return null;
  }

  @override
  List<Object?> get props => [
        id,
        name,
        code,
        planTier,
        maxEmployees,
        enabledFeatures,
        billingEmail,
        logoUrl,
        createdAt,
        updatedAt,
      ];
}

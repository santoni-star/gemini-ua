/// Available features in the application
/// Each feature can be enabled/disabled per company plan
enum AppFeature {
  /// Basic features (always enabled)
  auth,
  profile,
  notifications,

  /// Core features
  chat,
  shifts,
  polls,
  calls,

  /// Premium features
  payroll,
  tasks,

  /// Enterprise features
  analytics,
  auditLog,
  endToEndEncryption,
}

/// Plan tiers
enum PlanTier {
  starter,
  growth,
  enterprise,
}

/// Company plan configuration
class CompanyPlan {
  final PlanTier tier;
  final Set<AppFeature> enabledFeatures;
  final int maxEmployees;
  final double basePrice;
  final double? pricePerExtraEmployee;

  const CompanyPlan({
    required this.tier,
    required this.enabledFeatures,
    required this.maxEmployees,
    required this.basePrice,
    this.pricePerExtraEmployee,
  });

  /// Check if feature is enabled
  bool hasFeature(AppFeature feature) => enabledFeatures.contains(feature);

  /// Calculate monthly price for given employee count
  double calculatePrice(int employeeCount) {
    if (employeeCount <= maxEmployees) {
      return basePrice;
    }
    
    if (pricePerExtraEmployee == null) {
      return basePrice;
    }

    final extraEmployees = employeeCount - maxEmployees;
    return basePrice + (extraEmployees * pricePerExtraEmployee!);
  }

  /// Predefined plans (PLN)
  static const starter = CompanyPlan(
    tier: PlanTier.starter,
    enabledFeatures: {
      AppFeature.auth,
      AppFeature.profile,
      AppFeature.notifications,
      AppFeature.chat,
      AppFeature.shifts,
      AppFeature.polls,
    },
    maxEmployees: 50,
    basePrice: 299.0,
  );

  static const growth = CompanyPlan(
    tier: PlanTier.growth,
    enabledFeatures: {
      AppFeature.auth,
      AppFeature.profile,
      AppFeature.notifications,
      AppFeature.chat,
      AppFeature.shifts,
      AppFeature.polls,
      AppFeature.calls,
      AppFeature.payroll,
      AppFeature.tasks,
    },
    maxEmployees: 50,
    basePrice: 499.0,
    pricePerExtraEmployee: 4.99,
  );

  static const enterprise = CompanyPlan(
    tier: PlanTier.enterprise,
    enabledFeatures: {
      AppFeature.auth,
      AppFeature.profile,
      AppFeature.notifications,
      AppFeature.chat,
      AppFeature.shifts,
      AppFeature.polls,
      AppFeature.calls,
      AppFeature.payroll,
      AppFeature.tasks,
      AppFeature.analytics,
      AppFeature.auditLog,
      AppFeature.endToEndEncryption,
    },
    maxEmployees: 300,
    basePrice: 999.0,
    pricePerExtraEmployee: 2.99,
  );

  /// Get plan by tier
  static CompanyPlan fromTier(PlanTier tier) {
    switch (tier) {
      case PlanTier.starter:
        return starter;
      case PlanTier.growth:
        return growth;
      case PlanTier.enterprise:
        return enterprise;
    }
  }
}

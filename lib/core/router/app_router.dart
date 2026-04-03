import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/shifts/presentation/screens/shifts_screen.dart';

/// Router configuration
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  final isAuthenticated = authState.user != null;

  return GoRouter(
    initialLocation: '/auth/login',
    redirect: (context, state) {
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (!isAuthenticated && !isAuthRoute) {
        return '/auth/login';
      }

      if (isAuthenticated && isAuthRoute) {
        return '/shifts';
      }

      return null;
    },
    routes: [
      // Auth routes
      GoRoute(
        path: '/auth/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // Main app routes
      GoRoute(
        path: '/shifts',
        name: 'shifts',
        builder: (context, state) => const ShiftsScreen(),
      ),
      
      // Home redirect to shifts
      GoRoute(
        path: '/',
        builder: (context, state) => const RedirectToShifts(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('404 - Page not found: ${state.uri}')),
    ),
  );
});

class RedirectToShifts extends StatelessWidget {
  const RedirectToShifts({super.key});

  @override
  Widget build(BuildContext context) {
    Future.microtask(() => context.go('/shifts'));
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}

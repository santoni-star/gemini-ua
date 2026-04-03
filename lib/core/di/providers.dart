import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../packages/supabase_client_wrapper/lib/core/database_client.dart';

/// Supabase client provider (singleton)
final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

/// Database client provider
final databaseClientProvider = Provider<DatabaseClient>((ref) {
  return SupabaseDatabaseClient(ref.watch(supabaseClientProvider));
});

/// Current user ID provider
final currentUserIdProvider = Provider<String?>((ref) {
  return Supabase.instance.client.auth.currentUser?.id;
});

/// Check if user is authenticated
final isAuthenticatedProvider = Provider<bool>((ref) {
  return Supabase.instance.client.auth.currentUser != null;
});

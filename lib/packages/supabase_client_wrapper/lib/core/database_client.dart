import 'package:supabase_flutter/supabase_flutter.dart';

/// Abstract database client interface
/// Allows switching between Supabase, Firebase, etc. without changing domain layer
abstract class DatabaseClient {
  /// Select records from table
  Future<List<Map<String, dynamic>>> select(
    String table, {
    Map<String, dynamic>? match,
    String? order,
    int? limit,
    int? offset,
  });

  /// Insert new record
  Future<Map<String, dynamic>> insert(
    String table,
    Map<String, dynamic> data, {
    bool returning = true,
  });

  /// Update existing record
  Future<void> update(
    String table,
    Map<String, dynamic> data,
    String id, {
    String idColumn = 'id',
  });

  /// Delete record
  Future<void> delete(
    String table,
    String id, {
    String idColumn = 'id',
  });

  /// Stream realtime changes
  Stream<List<Map<String, dynamic>>> stream(
    String table, {
    String? primaryKey,
    Map<String, dynamic>? filters,
  });

  /// Count records
  Future<int> count(
    String table, {
    Map<String, dynamic>? filters,
  });

  /// Execute RPC function
  Future<dynamic> rpc(
    String function, {
    Map<String, dynamic>? params,
  });
}

/// Supabase implementation of DatabaseClient
class SupabaseDatabaseClient implements DatabaseClient {
  final SupabaseClient client;

  SupabaseDatabaseClient(this.client);

  @override
  Future<List<Map<String, dynamic>>> select(
    String table, {
    Map<String, dynamic>? match,
    String? order,
    int? limit,
    int? offset,
  }) async {
    dynamic query = client.from(table).select();

    if (match != null) {
      for (final entry in match.entries) {
        query = query.eq(entry.key, entry.value);
      }
    }

    if (order != null) {
      query = query.order(order);
    }

    if (limit != null) {
      query = query.limit(limit);
    }

    if (offset != null) {
      query = query.range(offset, offset + (limit ?? 0) - 1);
    }

    final response = await query;
    return List<Map<String, dynamic>>.from(response as List);
  }

  @override
  Future<Map<String, dynamic>> insert(
    String table,
    Map<String, dynamic> data, {
    bool returning = true,
  }) async {
    final builder = client.from(table).insert(data);

    if (!returning) {
      await builder;
      return {};
    }

    final response = await builder.select().single();
    return response;
  }

  @override
  Future<void> update(
    String table,
    Map<String, dynamic> data,
    String id, {
    String idColumn = 'id',
  }) async {
    await client.from(table).update(data).eq(idColumn, id);
  }

  @override
  Future<void> delete(
    String table,
    String id, {
    String idColumn = 'id',
  }) async {
    await client.from(table).delete().eq(idColumn, id);
  }

  @override
  Stream<List<Map<String, dynamic>>> stream(
    String table, {
    String? primaryKey,
    Map<String, dynamic>? filters,
  }) {
    final stream = client.from(table).stream(
      primaryKey: [primaryKey ?? 'id'],
    );

    return stream.map((data) => data as List<Map<String, dynamic>>);
  }

  @override
  Future<int> count(
    String table, {
    Map<String, dynamic>? filters,
  }) async {
    dynamic query = client.from(table).select();

    if (filters != null) {
      for (final entry in filters.entries) {
        query = query.eq(entry.key, entry.value);
      }
    }

    // In 2.x, .count() can be chained to return count in PostgrestResponse
    final response = await query.count(CountOption.exact);
    return response.count ?? 0;
  }

  @override
  Future<dynamic> rpc(
    String function, {
    Map<String, dynamic>? params,
  }) async {
    return await client.rpc(function, params: params ?? {});
  }
}

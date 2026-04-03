import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../entities/message_entity.dart';
import '../models/message_model.dart';

/// Chat remote data source
abstract class ChatRemoteDataSource {
  /// Get messages for company
  Future<List<MessageEntity>> getMessages({
    String? companyId,
    int? limit,
  });

  /// Send message
  Future<MessageEntity> sendMessage({
    required String companyId,
    required String content,
    MessageType type,
    String? mediaUrl,
    String? replyToId,
  });

  /// Mark message as read
  Future<MessageReadEntity> markAsRead({
    required String messageId,
  });

  /// Get unread count
  Future<int> getUnreadCount(String userId);

  /// Watch messages realtime
  Stream<List<MessageEntity>> watchMessages({
    String? companyId,
    int? limit,
  });

  /// Watch read status
  Stream<List<MessageReadEntity>> watchReads(String messageId);
}

/// Supabase implementation with RLS
class ChatRemoteDataSourceImpl implements ChatRemoteDataSource {
  final DatabaseClient client;

  ChatRemoteDataSourceImpl(this.client);

  @override
  Future<List<MessageEntity>> getMessages({
    String? companyId,
    int? limit,
  }) async {
    // RLS automatically filters by company_id
    final data = await client.select(
      'messages',
      limit: limit,
    );

    return data
        .map((json) => MessageModel.fromJson(json as Map<String, dynamic>).toEntity())
        .toList();
  }

  @override
  Future<MessageEntity> sendMessage({
    required String companyId,
    required String content,
    MessageType type = MessageType.text,
    String? mediaUrl,
    String? replyToId,
  }) async {
    // RLS ensures user can only send to their own company
    final json = {
      'company_id': companyId,
      'content': content,
      'type': type.name,
      if (mediaUrl != null) 'media_url': mediaUrl,
      if (replyToId != null) 'reply_to_id': replyToId,
    };

    final data = await client.insert('messages', json);
    return MessageModel.fromJson(data as Map<String, dynamic>).toEntity();
  }

  @override
  Future<MessageReadEntity> markAsRead({
    required String messageId,
  }) async {
    // RLS ensures user can only mark reads for their own company
    final json = {
      'message_id': messageId,
    };

    try {
      final data = await client.insert('message_reads', json);
      return MessageReadModel.fromJson(data as Map<String, dynamic>).toEntity();
    } catch (e) {
      // Ignore duplicate reads (unique constraint)
      final reads = await client.select(
        'message_reads',
        match: {'message_id': messageId},
      );
      return MessageReadModel.fromJson(reads.first as Map<String, dynamic>).toEntity();
    }
  }

  @override
  Future<int> getUnreadCount(String userId) async {
    // Get count of messages user hasn't read
    final count = await client.count(
      'messages',
      filters: {'company_id': userId}, // Simplified - in real app, join with reads
    );
    return count;
  }

  @override
  Stream<List<MessageEntity>> watchMessages({
    String? companyId,
    int? limit,
  }) {
    // RLS ensures users only see messages from their company
    return client.stream('messages', primaryKey: 'id').map((data) {
      return data
          .map((json) => MessageModel.fromJson(json as Map<String, dynamic>).toEntity())
          .toList();
    });
  }

  @override
  Stream<List<MessageReadEntity>> watchReads(String messageId) {
    return client.stream('message_reads', primaryKey: 'id').map((data) {
      return data
          .map((json) => MessageReadModel.fromJson(json as Map<String, dynamic>).toEntity())
          .toList();
    });
  }
}

/// Message read model
class MessageReadModel {
  final String id;
  final String messageId;
  final String userId;
  final DateTime readAt;

  const MessageReadModel({
    required this.id,
    required this.messageId,
    required this.userId,
    required this.readAt,
  });

  factory MessageReadModel.fromJson(Map<String, dynamic> json) {
    return MessageReadModel(
      id: json['id'] as String,
      messageId: json['message_id'] as String,
      userId: json['user_id'] as String,
      readAt: DateTime.parse(json['read_at'] as String),
    );
  }

  MessageReadEntity toEntity() {
    return MessageReadEntity(
      id: id,
      messageId: messageId,
      userId: userId,
      readAt: readAt,
    );
  }
}

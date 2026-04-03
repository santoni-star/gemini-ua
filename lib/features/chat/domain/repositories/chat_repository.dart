import '../../../../core/utils/base_repository.dart';
import '../../../../core/utils/result.dart';
import '../entities/message_entity.dart';

/// Chat repository interface (domain layer)
abstract class ChatRepository extends BaseRepository<MessageEntity, String> {
  /// Send message
  Future<Result<MessageEntity>> sendMessage({
    required String companyId,
    required String content,
    MessageType type,
    String? mediaUrl,
    String? replyToId,
  });

  /// Mark message as read
  Future<Result<MessageReadEntity>> markAsRead({
    required String messageId,
  });

  /// Get unread count for user
  Future<Result<int>> getUnreadCount(String userId);

  /// Watch messages realtime (company isolated via RLS)
  Stream<List<MessageEntity>> watchMessages({
    String? companyId,
    int? limit,
  });

  /// Watch read status for message
  Stream<List<MessageReadEntity>> watchReads(String messageId);
}

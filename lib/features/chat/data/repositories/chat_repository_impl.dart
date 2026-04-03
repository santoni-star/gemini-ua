import '../../../../core/errors/app_error.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/message_entity.dart';
import '../../domain/repositories/chat_repository.dart';
import '../datasources/chat_remote_datasource.dart';

/// Chat repository implementation
class ChatRepositoryImpl implements ChatRepository {
  final ChatRemoteDataSource dataSource;

  ChatRepositoryImpl(this.dataSource);

  @override
  Future<Result<List<MessageEntity>>> getAll({Map<String, dynamic>? filters}) async {
    try {
      final messages = await dataSource.getMessages();
      return Success(messages);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<MessageEntity>> getById(String id) async {
    try {
      final messages = await dataSource.getMessages();
      final message = messages.firstWhere((m) => m.id == id);
      return Success(message);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<MessageEntity>> create(MessageEntity entity) async {
    return sendMessage(
      companyId: entity.companyId,
      content: entity.content,
      type: entity.type,
      mediaUrl: entity.mediaUrl,
      replyToId: entity.replyToId,
    );
  }

  @override
  Future<Result<MessageEntity>> update(String id, MessageEntity entity) async {
    // Messages are immutable - return existing
    return getById(id);
  }

  @override
  Future<Result<void>> delete(String id) async {
    // Not implemented - messages are typically soft-deleted
    return const Success(null);
  }

  @override
  Future<Result<MessageEntity>> sendMessage({
    required String companyId,
    required String content,
    MessageType type = MessageType.text,
    String? mediaUrl,
    String? replyToId,
  }) async {
    try {
      final message = await dataSource.sendMessage(
        companyId: companyId,
        content: content,
        type: type,
        mediaUrl: mediaUrl,
        replyToId: replyToId,
      );
      return Success(message);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<MessageReadEntity>> markAsRead({
    required String messageId,
  }) async {
    try {
      final read = await dataSource.markAsRead(messageId: messageId);
      return Success(read);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Future<Result<int>> getUnreadCount(String userId) async {
    try {
      final count = await dataSource.getUnreadCount(userId);
      return Success(count);
    } catch (e) {
      return Failure(DatabaseError(message: e.toString()));
    }
  }

  @override
  Stream<List<MessageEntity>> watchMessages({
    String? companyId,
    int? limit,
  }) {
    // RLS ensures company isolation
    return dataSource.watchMessages(companyId: companyId, limit: limit);
  }

  @override
  Stream<List<MessageReadEntity>> watchReads(String messageId) {
    return dataSource.watchReads(messageId);
  }
}

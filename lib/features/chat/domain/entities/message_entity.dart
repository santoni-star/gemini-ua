import 'package:equatable/equatable.dart';

/// Message entity (domain layer)
class MessageEntity extends Equatable {
  final String id;
  final String companyId;
  final String senderId;
  final String content;
  final MessageType type;
  final String? mediaUrl;
  final String? replyToId;
  final bool isEdited;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const MessageEntity({
    required this.id,
    required this.companyId,
    required this.senderId,
    required this.content,
    this.type = MessageType.text,
    this.mediaUrl,
    this.replyToId,
    this.isEdited = false,
    required this.createdAt,
    this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        companyId,
        senderId,
        content,
        type,
        mediaUrl,
        replyToId,
        isEdited,
        createdAt,
        updatedAt,
      ];
}

/// Message type enum
enum MessageType {
  text,
  image,
  file,
  system,
}

/// Message read status entity
class MessageReadEntity extends Equatable {
  final String id;
  final String messageId;
  final String userId;
  final DateTime readAt;

  const MessageReadEntity({
    required this.id,
    required this.messageId,
    required this.userId,
    required this.readAt,
  });

  @override
  List<Object?> get props => [id, messageId, userId, readAt];
}

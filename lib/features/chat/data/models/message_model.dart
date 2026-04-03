import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/message_entity.dart';

part 'message_model.freezed.dart';
part 'message_model.g.dart';

/// Message model for JSON serialization
@freezed
class MessageModel with _$MessageModel {
  const factory MessageModel({
    required String id,
    required String company_id,
    required String sender_id,
    required String content,
    required String type,
    String? media_url,
    String? reply_to_id,
    required bool is_edited,
    required DateTime created_at,
    DateTime? updated_at,
  }) = _MessageModel;

  factory MessageModel.fromJson(Map<String, dynamic> json) =>
      _$MessageModelFromJson(json);

  /// Convert from domain entity
  factory MessageModel.fromEntity(MessageEntity entity) {
    return MessageModel(
      id: entity.id,
      company_id: entity.companyId,
      sender_id: entity.senderId,
      content: entity.content,
      type: entity.type.name,
      media_url: entity.mediaUrl,
      reply_to_id: entity.replyToId,
      is_edited: entity.isEdited,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    );
  }

  /// Convert to domain entity
  MessageEntity toEntity() {
    return MessageEntity(
      id: id,
      companyId: company_id,
      senderId: sender_id,
      content: content,
      type: MessageType.values.firstWhere(
        (e) => e.name == type,
        orElse: () => MessageType.text,
      ),
      mediaUrl: media_url,
      replyToId: reply_to_id,
      isEdited: is_edited,
      createdAt: created_at,
      updatedAt: updated_at,
    );
  }
}

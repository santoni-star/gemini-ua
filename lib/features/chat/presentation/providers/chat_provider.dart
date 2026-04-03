import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/di/providers.dart';
import '../../../../packages/supabase_client_wrapper/lib/core/database_client.dart';
import '../../data/datasources/chat_remote_datasource.dart';
import '../../data/repositories/chat_repository_impl.dart';
import '../../domain/repositories/chat_repository.dart';
import '../entities/message_entity.dart';

part 'chat_provider.g.dart';

/// Chat data source provider
final chatDataSourceProvider = Provider<ChatRemoteDataSource>((ref) {
  return ChatRemoteDataSourceImpl(ref.watch(databaseClientProvider));
});

/// Chat repository provider
final chatRepositoryProvider = Provider<ChatRepository>((ref) {
  return ChatRepositoryImpl(ref.watch(chatDataSourceProvider));
});

/// Watch messages stream provider
@riverpod
Stream<List<MessageEntity>> messagesStream(MessagesStreamRef ref) {
  final repository = ref.watch(chatRepositoryProvider);
  return repository.watchMessages();
}

/// Current company ID provider (from auth)
final currentCompanyIdProvider = Provider<String?>((ref) {
  // In real app, get from auth state
  return null;
});

/// Chat input state
class ChatInputState {
  final String content;
  final bool isLoading;
  final bool isSending;

  const ChatInputState({
    this.content = '',
    this.isLoading = false,
    this.isSending = false,
  });

  ChatInputState copyWith({
    String? content,
    bool? isLoading,
    bool? isSending,
  }) {
    return ChatInputState(
      content: content ?? this.content,
      isLoading: isLoading ?? this.isLoading,
      isSending: isSending ?? this.isSending,
    );
  }
}

/// Chat input notifier
@riverpod
class ChatInputNotifier extends _$ChatInputNotifier {
  @override
  ChatInputState build() => const ChatInputState();

  void setContent(String content) {
    state = state.copyWith(content: content);
  }

  Future<void> sendMessage() async {
    if (state.content.isEmpty) return;

    state = state.copyWith(isSending: true);

    final companyId = ref.read(currentCompanyIdProvider);
    if (companyId == null) {
      state = state.copyWith(isSending: false);
      return;
    }

    try {
      final repository = ref.read(chatRepositoryProvider);
      await repository.sendMessage(
        companyId: companyId,
        content: state.content,
      );
      state = const ChatInputState();
    } catch (e) {
      state = state.copyWith(isSending: false);
    }
  }

  void clear() {
    state = const ChatInputState();
  }
}

/// Unread messages count provider
final unreadCountProvider = FutureProvider<int>((ref) async {
  final repository = ref.watch(chatRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);

  if (userId == null) return 0;

  final result = await repository.getUnreadCount(userId);
  return result.valueOrNull ?? 0;
});

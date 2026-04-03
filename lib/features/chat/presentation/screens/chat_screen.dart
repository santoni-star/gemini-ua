import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:gap/gap.dart';
import 'package:intl/intl.dart';
import '../../../../core/config/feature_flags.dart';
import '../../domain/entities/message_entity.dart';
import '../providers/chat_provider.dart';

/// Chat screen
class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _scrollController = ScrollController();
  final _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _textController.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _textController.dispose();
    super.dispose();
  }

  void _onTextChanged() {
    ref.read(chatInputNotifierProvider.notifier).setContent(_textController.text);
  }

  @override
  Widget build(BuildContext context) {
    final messagesAsync = ref.watch(messagesStreamProvider);
    final inputState = ref.watch(chatInputNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Team Chat'),
        actions: [
          // Unread badge
          ref.watch(unreadCountProvider).when(
                data: (count) => count > 0
                    ? Padding(
                        padding: EdgeInsets.only(right: 16.w),
                        child: Center(
                          child: Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 8.w,
                              vertical: 4.h,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(12.r),
                            ),
                            child: Text(
                              '$count',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      )
                    : const SizedBox.shrink(),
                loading: () => const SizedBox.shrink(),
                error: (_, __) => const SizedBox.shrink(),
              ),
        ],
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: messagesAsync.when(
              data: (messages) {
                if (messages.isEmpty) {
                  return _buildEmptyState();
                }

                // Group by date
                final grouped = _groupMessagesByDate(messages);

                return ListView.builder(
                  controller: _scrollController,
                  padding: EdgeInsets.all(16.w),
                  itemCount: grouped.length,
                  itemBuilder: (context, index) {
                    final date = grouped.keys.elementAt(index);
                    final dayMessages = grouped[date]!;

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Date separator
                        _buildDateSeparator(date),
                        Gap(12.h),

                        // Messages
                        ...dayMessages.map((msg) => _buildMessage(msg)),
                      ],
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => _buildErrorState(error.toString()),
            ),
          ),

          // Input
          _buildInputArea(inputState),
        ],
      ),
    );
  }

  Map<DateTime, List<MessageEntity>> _groupMessagesByDate(
    List<MessageEntity> messages,
  ) {
    final grouped = <DateTime, List<MessageEntity>>{};

    for (final msg in messages) {
      final date = DateTime(
        msg.createdAt.year,
        msg.createdAt.month,
        msg.createdAt.day,
      );
      grouped.putIfAbsent(date, () => []).add(msg);
    }

    return Map.fromEntries(
      grouped.entries.toList()..sort((a, b) => a.key.compareTo(b.key)),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.chat_bubble_outline,
            size: 80.sp,
            color: Colors.grey[400],
          ),
          Gap(16.h),
          Text(
            'No messages yet',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          Gap(8.h),
          Text(
            'Start the conversation!',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 60.sp,
            color: Colors.red[400],
          ),
          Gap(16.h),
          Text(
            'Failed to load messages',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          Gap(8.h),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 32.w),
            child: Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSeparator(DateTime date) {
    final isToday = DateTime.now().day == date.day &&
        DateTime.now().month == date.month &&
        DateTime.now().year == date.year;

    final isYesterday = DateTime.now().difference(date).inDays == 1;

    String label;
    if (isToday) {
      label = 'Today';
    } else if (isYesterday) {
      label = 'Yesterday';
    } else {
      label = DateFormat('EEEE, MMM d').format(date);
    }

    return Center(
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(20.r),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: Colors.grey[700],
            fontSize: 12.sp,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildMessage(MessageEntity message) {
    final isMe = message.senderId == ref.read(currentUserIdProvider);
    final timeFormat = DateFormat('HH:mm');

    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Row(
        mainAxisAlignment:
            isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            // Avatar placeholder
            CircleAvatar(
              radius: 16.r,
              backgroundColor: Colors.grey[300],
              child: Icon(Icons.person, size: 16.sp),
            ),
            Gap(8.w),
          ],

          Flexible(
            child: Column(
              crossAxisAlignment:
                  isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                // Sender name (for others)
                if (!isMe)
                  Padding(
                    padding: EdgeInsets.only(left: 4.w, bottom: 4.h),
                    child: Text(
                      'Team Member',
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),

                // Message bubble
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 16.w,
                    vertical: 12.h,
                  ),
                  decoration: BoxDecoration(
                    color: isMe
                        ? Theme.of(context).primaryColor
                        : Colors.grey[200],
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(16.r),
                      topRight: Radius.circular(16.r),
                      bottomLeft: Radius.circular(isMe ? 16.r : 4.r),
                      bottomRight: Radius.circular(isMe ? 4.r : 16.r),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        message.content,
                        style: TextStyle(
                          color: isMe ? Colors.white : Colors.black87,
                          fontSize: 15.sp,
                        ),
                      ),
                      Gap(4.h),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          timeFormat.format(message.createdAt),
                          style: TextStyle(
                            fontSize: 11.sp,
                            color: isMe ? Colors.white70 : Colors.grey[600],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          if (isMe) Gap(8.w),
        ],
      ),
    );
  }

  Widget _buildInputArea(ChatInputState state) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Attachment button
            IconButton(
              icon: Icon(Icons.attach_file, color: Colors.grey[600]),
              onPressed: () {
                // Handle attachment
              },
            ),
            Gap(8.w),

            // Text input
            Expanded(
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 16.w),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(24.r),
                ),
                child: TextField(
                  controller: _textController,
                  decoration: InputDecoration(
                    hintText: 'Type a message...',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 0,
                      vertical: 12.h,
                    ),
                  ),
                  maxLines: 4,
                  minLines: 1,
                  textCapitalization: TextCapitalization.sentences,
                ),
              ),
            ),
            Gap(8.w),

            // Send button
            CircleAvatar(
              backgroundColor: state.content.isEmpty
                  ? Colors.grey[300]
                  : Theme.of(context).primaryColor,
              child: IconButton(
                icon: Icon(
                  state.isSending ? Icons.hourglass_empty : Icons.send,
                  color: state.content.isEmpty
                      ? Colors.grey[500]
                      : Colors.white,
                ),
                onPressed: state.isSending || state.content.isEmpty
                    ? null
                    : () {
                        ref
                            .read(chatInputNotifierProvider.notifier)
                            .sendMessage();
                        _textController.clear();
                      },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { ChatRequest, ChatResponse, ConversationDetail, MessageResponse } from '../types/chat';
import { conversationKeys } from './conversation';

// API functions
const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>('/api/chat', request);
  return data;
};

// React Query hooks

/**
 * Hook to send a chat message
 * Handles both new conversations and existing ones
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data, variables) => {
      // If new conversation was created, invalidate the list
      if (!variables.conversation_id) {
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      }
      
      // Append new messages to conversation detail cache
      if (data.conversation_id) {
        queryClient.setQueryData<ConversationDetail>(
          conversationKeys.detail(data.conversation_id),
          (oldData) => {
            if (!oldData) return oldData;
            
            const now = new Date().toISOString();
            const newMessages: MessageResponse[] = [
              {
                id: Date.now(),
                role: 'user',
                content: variables.message,
                created_at: now,
              },
              {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.response,
                created_at: now,
              },
            ];
            
            return {
              ...oldData,
              messages: [...oldData.messages, ...newMessages],
              updated_at: now,
            };
          }
        );
      }
    },
  });
};

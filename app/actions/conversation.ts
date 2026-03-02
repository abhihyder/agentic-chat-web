import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { ConversationListItem, ConversationDetail } from '../types/chat';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: { limit?: number; offset?: number }) => 
    [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: number) => [...conversationKeys.details(), id] as const,
};

// API functions
const fetchConversations = async (
  limit: number = 20, 
  offset: number = 0
): Promise<ConversationListItem[]> => {
  const { data } = await apiClient.get<ConversationListItem[]>('/api/conversations', {
    params: { limit, offset },
  });
  return data;
};

const fetchConversationDetail = async (
  conversationId: number
): Promise<ConversationDetail> => {
  const { data } = await apiClient.get<ConversationDetail>(
    `/api/conversations/${conversationId}`
  );
  return data;
};

const deleteConversation = async (conversationId: number): Promise<void> => {
  await apiClient.delete(`/api/conversations/${conversationId}`);
};

// React Query hooks

/**
 * Hook to fetch list of conversations
 */
export const useConversations = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: conversationKeys.list({ limit, offset }),
    queryFn: () => fetchConversations(limit, offset),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch conversation details with messages
 */
export const useConversationDetail = (conversationId: number | null) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId!),
    queryFn: () => fetchConversationDetail(conversationId!),
    enabled: conversationId !== null,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to delete a conversation
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      // Invalidate conversations list to refetch
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};

/**
 * Hook to prefetch conversation detail
 */
export const usePrefetchConversation = () => {
  const queryClient = useQueryClient();

  return (conversationId: number) => {
    queryClient.prefetchQuery({
      queryKey: conversationKeys.detail(conversationId),
      queryFn: () => fetchConversationDetail(conversationId),
      staleTime: 1000 * 60, // 1 minute
    });
  };
};

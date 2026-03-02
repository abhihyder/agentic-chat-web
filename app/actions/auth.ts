import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// API functions
const fetchUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/api/user/profile');
  return data;
};

const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

// React Query hooks

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: fetchUserProfile,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to logout user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });
};

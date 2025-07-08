import { useState } from 'react';

type Platform = 'google' | 'twitter' | 'telegram' | 'discord';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  userData: any | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    userData: null
  });

  const authenticate = async (platform: Platform) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // 构建 OAuth URL
      const oauthUrl = `/api/auth/${platform}`;
      
      // 打开 OAuth 窗口
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const authWindow = window.open(
        oauthUrl,
        `${platform}Auth`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // 监听消息
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'auth_success') {
          // 获取用户数据
          const response = await fetch('/api/user/profile');
          const userData = await response.json();
          setAuthState({
            isLoading: false,
            error: null,
            userData
          });
        } else if (event.data.type === 'auth_error') {
          setAuthState({
            isLoading: false,
            error: event.data.error,
            userData: null
          });
        }

        window.removeEventListener('message', handleMessage);
        authWindow?.close();
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      setAuthState({
        isLoading: false,
        error: error instanceof Error ? error.message : '身份验证失败',
        userData: null
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthState({
        isLoading: false,
        error: null,
        userData: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '登出失败'
      }));
    }
  };

  return {
    ...authState,
    authenticate,
    logout
  };
}
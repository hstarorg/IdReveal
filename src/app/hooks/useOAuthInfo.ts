import { useState } from 'react';

export type PlatformName = 'google' | 'twitter' | 'telegram' | 'discord';

type PlatformUserInfo = {
  id: string;
  name: string;
};

type OAuthState = {
  userData: PlatformUserInfo | null;
  isLoading: boolean;
  error: string | null;
};

export function useOAuthInfo(platformName: PlatformName) {
  const [oauthState, setOAuthState] = useState<OAuthState>({
    isLoading: false,
    error: null,
    userData: null,
  });

  const connect = async () => {
    try {
      setOAuthState((prev) => ({ ...prev, userData: null, error: null }));

      // 构建 OAuth URL
      const oauthUrl = `/api/connect/${platformName}`;

      // 打开 OAuth 窗口
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const authWindow = window.open(
        oauthUrl,
        `${platformName}Auth`,
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      // 监听消息
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'auth_success') {
          // 获取用户数据
          const response = await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform: platformName, code: event.data.code }),
          });
          const userData = await response.json();
          setOAuthState({
            isLoading: false,
            error: null,
            userData,
          });
        } else if (event.data.type === 'auth_error') {
          setOAuthState({
            isLoading: false,
            error: event.data.error,
            userData: null,
          });
        }

        window.removeEventListener('message', handleMessage);
        authWindow?.close();
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      setOAuthState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connect failed',
        userData: null,
      });
    }
  };

  const disconnect = async () => {
    setOAuthState({
      isLoading: false,
      error: null,
      userData: null,
    });
  };

  return {
    ...oauthState,
    connect,
    disconnect,
  };
}

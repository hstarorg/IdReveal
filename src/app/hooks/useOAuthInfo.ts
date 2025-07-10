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
      const { authorizeUrl } = await (await fetch(`/api/connect/${platformName}`)).json();

      // 打开 OAuth 窗口
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const authWindow = window.open(
        authorizeUrl,
        `${platformName}Auth`,
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      // 监听消息
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        const eventData = event.data;

        if (eventData.type === 'auth_success') {
          // 获取用户数据
          const response = await fetch(`/api/connect/${platformName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: eventData.payload?.code }),
          });
          const userData = await response.json();
          setOAuthState({
            isLoading: false,
            error: null,
            userData,
          });
        } else if (eventData.type === 'auth_error') {
          setOAuthState({
            isLoading: false,
            error: eventData.error,
            userData: null,
          });
        }

        window.removeEventListener('message', handleMessage);
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

import { useMemo, useState } from 'react';

export type PlatformName = 'google' | 'twitter' | 'telegram' | 'discord';

type PlatformUserInfo = {
  id: string;
  username: string;
  originalData: Record<string, any>;
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

  const channel = useMemo(() => {
    return new BroadcastChannel('id-reveal:oauth-callback');
  }, []);

  const connect = async () => {
    try {
      setOAuthState((prev) => ({ ...prev, userData: null, error: null }));

      // 构建 OAuth URL
      const { authorizeUrl } =
        platformName === 'telegram'
          ? { authorizeUrl: 'https://tg-brother.vercel.app/?bot_name=TgBrother_bot&close=1' }
          : await (await fetch(`/api/connect/${platformName}`)).json();

      // 打开 OAuth 窗口
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      window.open(authorizeUrl, `${platformName}Auth`, `width=${width},height=${height},left=${left},top=${top}`);

      const handleMessageChannelMessage = async (event: MessageEvent) => {
        const { type, payload } = event.data || {};
        if (payload.platform !== platformName) {
          console.warn(`Received message for platform ${payload.platform}, expected ${platformName}, ignoring.`);
          return;
        }
        if (type === 'auth_success') {
          // 获取用户数据
          const response = await fetch(`/api/connect/${platformName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: payload?.code }),
          });
          const userData = await response.json();
          setOAuthState({
            isLoading: false,
            error: null,
            userData,
          });
        }
        channel.close();
      };

      // 监听消息
      const handlePostMessage = async (event: MessageEvent) => {
        const eventData = event.data;
        if (event.origin === 'https://tg-brother.vercel.app' && eventData.type === 'tg-brother:telegram_login') {
          setOAuthState({
            isLoading: false,
            error: null,
            userData: {
              id: eventData.payload?.id,
              username: eventData.payload?.username,
              originalData: eventData.payload,
            },
          });
          return;
        }
        window.removeEventListener('message', handlePostMessage);
      };

      if (platformName === 'telegram') {
        // 特殊处理 Telegram 的登录
        window.addEventListener('message', handlePostMessage);
      } else {
        // 其他平台使用 BroadcastChannel
        channel.onmessage = handleMessageChannelMessage;
      }
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

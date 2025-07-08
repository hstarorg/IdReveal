import { FC } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PlatformCardProps {
  platform: 'google' | 'twitter' | 'telegram' | 'discord';
  onClick: () => void;
  disabled?: boolean;
}

const PlatformCard: FC<PlatformCardProps> = ({ platform, onClick, disabled }) => {
  const platformInfo = {
    google: {
      name: 'Google',
      icon: 'M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z',
      bgColor: 'bg-red-500'
    },
    twitter: {
      name: 'Twitter',
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      bgColor: 'bg-blue-400'
    },
    telegram: {
      name: 'Telegram',
      icon: 'M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-1.082.362-1.61.984-.133.155-.267.354-.335.628s-.038.622.095.895c.265.547.714.773 1.244.976 1.76.564 3.58 1.102 5.087 1.608.556 1.96 1.09 3.927 1.618 5.89.174.394.553.54.944.544l-.002.02s.307.03.606-.042c.3-.07.677-.244 1.02-.565.377-.354 1.4-1.36 1.98-1.928l4.37 3.226.035.02s.484.34 1.192.388c.354.024.82-.044 1.22-.337.403-.294.67-.767.795-1.307.374-1.63 2.853-13.427 3.276-15.38l-.012.046c.296-1.1.187-2.108-.496-2.705-.342-.297-.736-.427-1.13-.444zm-.118 1.874c.027.025.025.025.002.027-.007-.002.08.118-.09.755l-.007.024-.005.022c-.432 1.997-2.936 13.9-3.27 15.356-.046.196-.065.182-.054.17-.1-.015-.285-.094-.3-.1l-7.48-5.525c2.562-2.467 5.182-4.7 7.827-7.08.468-.235.39-.96-.17-.972-.594.14-1.095.567-1.64.84-3.132 1.858-6.332 3.492-9.43 5.406-1.59-.553-3.177-1.012-4.767-1.57.2-.075 1.353-.555 2.193-.9.836-.346 2.495-1.027 4.2-1.73 2.214-.857 4.504-1.742 6.19-2.397 2.097-.818 5.943-2.204 7.661-2.84z',
      bgColor: 'bg-blue-500'
    },
    discord: {
      name: 'Discord',
      icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
      bgColor: 'bg-indigo-600'
    }
  };

  const info = platformInfo[platform];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${info.bgColor} text-white p-4 rounded-lg w-full mb-4 flex items-center justify-center transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 mr-2"
        fill="currentColor"
      >
        <path d={info.icon} />
      </svg>
      <span>通过 {info.name} 验证身份</span>
    </button>
  );
};

export default function Home() {
  const { isLoading, error, userData, authenticate, logout } = useAuth();

  const handlePlatformAuth = async (platform: PlatformCardProps['platform']) => {
    await authenticate(platform);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧介绍 */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            ID Reveal - 身份验证解决方案
          </h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-4">
              ID Reveal 是一个强大的身份验证工具，帮助您快速验证用户的社交媒体身份。通过与主流平台的 OAuth 集成，我们提供：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>安全可靠的身份验证流程</li>
              <li>多平台身份信息整合</li>
              <li>实时身份数据获取</li>
              <li>简单易用的 API 接口</li>
            </ul>
          </div>
        </div>

        {/* 右侧验证卡片 */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          {userData ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                验证成功
              </h2>
              <div className="mb-6">
                <p className="text-gray-600">用户信息：</p>
                <pre className="bg-gray-100 p-4 rounded mt-2 text-left overflow-auto">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
              <button
                onClick={logout}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                退出登录
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                选择验证平台
              </h2>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {(['google', 'twitter', 'telegram', 'discord'] as const).map((platform) => (
                  <PlatformCard
                    key={platform}
                    platform={platform}
                    onClick={() => handlePlatformAuth(platform)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

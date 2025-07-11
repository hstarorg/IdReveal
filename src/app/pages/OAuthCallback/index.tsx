import { useMounted } from '@/app/hooks/useMounted';
import { useLocation, useParams } from 'react-router-dom';

export function OAuthCallback() {
  const params = useParams();
  const loc = useLocation();

  useMounted(() => {
    const query = new URLSearchParams(loc.search);
    const code = query.get('code');
    if (code) {
      const channel = new BroadcastChannel('id-reveal:oauth-callback');
      channel.postMessage({ type: 'auth_success', payload: { code, platform: params.id } });
      window.close();
    }
  });

  return <div>OAuth Callback - {params.id}</div>;
}

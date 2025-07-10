import { useMounted } from '@/app/hooks/useMounted';
import { useLocation, useParams } from 'react-router-dom';

export function OAuthCallback() {
  const params = useParams();
  const loc = useLocation();

  useMounted(() => {
    const query = new URLSearchParams(loc.search);
    const code = query.get('code');
    if (code) {
      window.opener?.postMessage({ type: 'auth_success', payload: { code } }, '*');
      window.close();
    }
  });

  return <div>xxx - {params.id}</div>;
}

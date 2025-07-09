import { HTTPException } from 'hono/http-exception';
import { GoogleProvider } from './oauth-providers/google-provider';

export function getOAuthRedirectUrl(env: Env, platform: string) {
  const provider = getOAuthProvider(platform, env);
  return provider.getAuthorizeUrl();
}

export async function getUserInfo(env: Env, platform: string, code: string) {
  const provider = getOAuthProvider(platform, env);
  const accessTokenRes = await provider.getAccessToken(code);
  const userInfo = await provider.getUserInfo(accessTokenRes.accessToken);
  return userInfo;
}

function getOAuthProvider(platform: string, env: Env) {
  if (platform === 'google') {
    const [clientId, clientSecret, redirectUri] = env.Google_OAuth?.split('|') || [];
    return new GoogleProvider({ clientId, clientSecret, redirectUri });
  }
  throw new HTTPException(400, { message: 'Unsupported platform' });
}

import { HTTPException } from 'hono/http-exception';
import { Platform, PlatformValues } from '../constants';

import { GoogleProvider } from './oauth-providers/google/provider';
import { XProvider } from './oauth-providers/x/provider';
import { DiscordProvider } from './oauth-providers/discord/provider';

export function getOAuthRedirectUrl(env: Env, platform: PlatformValues) {
  const provider = getOAuthProvider(platform, env);
  return provider.getAuthorizeUrl();
}

export async function getUserInfo(env: Env, platform: PlatformValues, code: string) {
  const provider = getOAuthProvider(platform, env);
  const accessTokenRes = await provider.getAccessToken(code);
  const userInfo = await provider.getUserInfo(accessTokenRes.accessToken);
  return userInfo;
}

function getOAuthProvider(platform: PlatformValues, env: Env) {
  if (platform === Platform.Google) {
    const [clientId, clientSecret, redirectUri] = env.Google_OAuth?.split('|') || [];
    return new GoogleProvider({ clientId, clientSecret, redirectUri });
  } else if (platform === Platform.X) {
    const [clientId, clientSecret, redirectUri] = env.X_OAuth.split('|') || [];
    return new XProvider({ clientId, clientSecret, redirectUri, state: Date.now().toString() });
  } else if (platform === Platform.Discord) {
    const [clientId, clientSecret, redirectUri] = env.Discord_OAuth.split('|') || [];
    return new DiscordProvider({ clientId, clientSecret, redirectUri });
  }
  throw new HTTPException(400, { message: 'Unsupported platform' });
}

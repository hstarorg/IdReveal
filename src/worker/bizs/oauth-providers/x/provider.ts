import { HTTPException } from 'hono/http-exception';
import { toQueryParams } from '../../../utils';
import { IOAuthProvider } from '../IOAuthProvider';
import { GetAccessTokenOutput, GetUserInfoOutput } from '../types';
import { XErrorResponse, XFields, XMeResponse, XScopes, XTokenResponse } from './types';

export type XProviderOptions = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state?: string;
};

export class XProvider implements IOAuthProvider {
  constructor(private options: XProviderOptions) {}

  async getAuthorizeUrl(): Promise<string> {
    const parsedOptions = toQueryParams({
      response_type: 'code',
      redirect_uri: this.options.redirectUri,
      client_id: this.options.clientId,
      scope: (['users.read', 'tweet.read', 'offline.access'] as XScopes[]).join(' '),
      state: this.options.state,
      code_challenge: 'challenge',
      //   code_challenge_method: 'S256',
      code_challenge_method: 'plain',
    });

    return `https://x.com/i/oauth2/authorize?${parsedOptions}`;
  }

  async getAccessToken(code: string): Promise<GetAccessTokenOutput> {
    const parsedOptions = toQueryParams({
      code,
      grant_type: 'authorization_code',
      client_id: this.options.clientId,
      redirect_uri: this.options.redirectUri,
      code_verifier: 'challenge',
    });

    const authToken = btoa(
      `${encodeURIComponent(this.options.clientId)}:${encodeURIComponent(this.options.clientSecret)}`,
    );

    const response = (await fetch(`https://api.x.com/2/oauth2/token?${parsedOptions}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authToken}`,
      },
    }).then((res) => res.json())) as XTokenResponse | XErrorResponse;

    if ('error' in response) {
      throw new HTTPException(400, { message: response.error_description });
    }

    const result = response as XTokenResponse;

    return {
      accessToken: result.access_token,
      tokenType: result.token_type,
      expiresIn: result.expires_in,
      scope: result.scope,
      refreshToken: result.refresh_token,
    };
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoOutput> {
    const parsedOptions = toQueryParams({
      'user.fields': [
        'created_at',
        'description',
        'entities',
        'id',
        'location',
        'most_recent_tweet_id',
        'name',
        'pinned_tweet_id',
        'profile_image_url',
        'protected',
        'public_metrics',
        'url',
        'username',
        'verified',
        'verified_type',
        'withheld',
      ] as XFields[],
    });

    const response = (await fetch(`https://api.x.com/2/users/me?${parsedOptions}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as XMeResponse | XErrorResponse;

    if ('error_description' in response) {
      throw new HTTPException(400, { message: response.error_description });
    }

    const result = response as XMeResponse;
    return {
      id: result.data.id,
      username: result.data.username,
      originalData: result.data,
    };
  }
}

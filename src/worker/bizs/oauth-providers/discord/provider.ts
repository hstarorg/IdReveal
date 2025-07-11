import { HTTPException } from 'hono/http-exception';
import { toQueryParams } from '../../../utils';
import { IOAuthProvider } from '../IOAuthProvider';
import { GetAccessTokenOutput, GetUserInfoOutput } from '../types';
import { DiscordErrorResponse, DiscordMeResponse, DiscordTokenResponse, Scopes } from './types';

export type DiscordProviderOptions = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state?: string;
};

export class DiscordProvider implements IOAuthProvider {
  constructor(private options: DiscordProviderOptions) {}

  async getAuthorizeUrl(): Promise<string> {
    const parsedOptions = toQueryParams({
      response_type: 'code',
      client_id: this.options.clientId,
      scope: (['identify', 'email'] as Scopes[]).join(' '),
      state: this.options.state,
      prompt: 'consent',
      redirect_uri: this.options.redirectUri,
    });
    return `https://discord.com/oauth2/authorize?${parsedOptions}`;
  }

  async getAccessToken(code: string): Promise<GetAccessTokenOutput> {
    const parsedOptions = toQueryParams({
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.options.redirectUri,
    });
    const url = 'https://discord.com/api/oauth2/token';

    const response = (await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parsedOptions,
    }).then((res) => res.json())) as DiscordTokenResponse | DiscordErrorResponse;

    this._checkResponse(response);

    const result = response as DiscordTokenResponse;
    console.log(result);
    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
      refreshToken: result.refresh_token,
      scope: result.scope,
    };
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoOutput> {
    const response = (await fetch('https://discord.com/api/oauth2/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as DiscordMeResponse | DiscordErrorResponse;

    this._checkResponse(response);

    const result = response as DiscordMeResponse;

    console.log(result);

    return {
      id: result.user.id,
      username: result.user.username,
      originalData: result.user,
    };
  }

  _checkResponse(response: DiscordMeResponse | DiscordTokenResponse | DiscordErrorResponse) {
    if ('error_description' in response) {
      throw new HTTPException(400, { message: response.error_description });
    }
    if ('error' in response) {
      throw new HTTPException(400, { message: response.error });
    }
    if ('message' in response) {
      throw new HTTPException(400, { message: response.message });
    }
  }
}

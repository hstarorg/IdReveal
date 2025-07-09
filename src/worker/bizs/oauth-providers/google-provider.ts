import { IOAuthProvider } from './IOAuthProvider';
import { GetAccessTokenOutput, GetUserInfoOutput } from './types';
import { toQueryParams } from '../../utils';
import { HTTPException } from 'hono/http-exception';

export type GoogleProviderOptions = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state?: string;
  loginHint?: string;
  prompt?: 'none' | 'consent' | 'select_account';
  accessType?: 'offline' | 'online';
};

export class GoogleProvider implements IOAuthProvider {
  constructor(private readonly options: GoogleProviderOptions) {}

  async getAuthorizeUrl(): Promise<string> {
    const parsedOptions = toQueryParams({
      response_type: 'code',
      redirect_uri: this.options.redirectUri,
      client_id: this.options.clientId,
      include_granted_scopes: true,
      scope: ['openid', 'email'].join(' '),
      state: this.options.state,
      prompt: this.options.prompt,
      login_hint: this.options.loginHint,
      access_type: this.options.accessType,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${parsedOptions}`;
  }

  async getAccessToken(code: string): Promise<GetAccessTokenOutput> {
    const response = (await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        redirect_uri: this.options.redirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    }).then((res) => res.json())) as GoogleTokenResponse | GoogleErrorResponse;

    if ('error' in response) {
      throw new HTTPException(400, { message: response.error_description });
    }
    const result = response as GoogleTokenResponse;

    console.log('Google access token response:', result);

    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
      grantedScopes: result.scope.split(' '),
      tokenType: result.token_type,
      idToken: result.id_token,
    };
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoOutput> {
    console.log('accessToken',accessToken);
    const response = (await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as GoogleUser | GoogleErrorResponse;

    if ('error' in response) {
      throw new HTTPException(400, { message: response.error?.message });
    }
    const result = response as GoogleUser;
    return {
      id: result.id,
      username: result.email,
      originalData: result,
    };
  }
}

export type GoogleErrorResponse = {
  error?: {
    code: number;
    message: string;
    status: string;
  };
  error_description: string;
};

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

export type GoogleTokenInfoResponse = {
  issued_to: string;
  audience: string;
  user_id: string;
  scope: string;
  expires_in: number;
  email: string;
  verified_email: boolean;
  access_type: string;
};

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

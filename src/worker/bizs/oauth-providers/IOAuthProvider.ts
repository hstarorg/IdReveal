import { GetAccessTokenOutput, GetUserInfoOutput } from './types';

export interface IOAuthProvider {
  getAuthorizeUrl(): Promise<string>;
  getAccessToken(code: string): Promise<GetAccessTokenOutput>;
  getUserInfo(accessToken: string): Promise<GetUserInfoOutput>;
}

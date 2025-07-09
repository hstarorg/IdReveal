export type GetAccessTokenOutput = {
  accessToken: string;
  [key: string]: any; // Allow additional properties
};

export type GetUserInfoOutput = {
  id: string | number;
  username: string;
  originalData?: any;
};

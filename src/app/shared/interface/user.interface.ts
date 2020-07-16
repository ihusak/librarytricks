export interface User {
  _id: string;
  userNane: string;
  confirmed: boolean;
  createdDate: string;
  email: string;
  role: {
    id: number,
    title: string,
    status: boolean
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  isServiceProvider: string;
  profileImageURL: string;
  bannerImageURL: string;
  token: string;
  refreshToken: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface OTPStatus {
  otpStatus: boolean;
}
export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
}
export type RootStackParamList = {
  RegisterUser: RegisterUser;
};

export interface RegisterCustomerModel {
  PersonName: string,
  EmailAddress: string,
  Password: string,
  ConfirmPassword: string,
  Role?: string
}

export interface LoginCustomerModel {
  Email: string
  Password: string
}

export interface SignupResponse {
  message: string;
  result: boolean;
  data: string | null;
}

export interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    token: {
      personName: string;
      email: string;
      token: string;    
      expiration: string;
    };
    user: {
      id: string;
      personName: string;
      email: string;
      roles: string[];
    };
  } | null;
}


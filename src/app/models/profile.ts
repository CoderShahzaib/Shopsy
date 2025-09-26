export interface RegisterCustomerModel {
  CustId: number
  Name: string
  MobileNo: string
  Password: string
}

export interface LoginCustomerModel {
  UserName: string
  UserPassword: string
}

export interface SignupResponse {
  message: string;
  result: boolean;
  data: string | null;
}


export interface LoginResponse {
  message: string;
  result: boolean;
  data: string | null;
}

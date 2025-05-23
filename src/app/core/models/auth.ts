//LOGIN DATA MODEL
export interface AuthLogin {
  email: string;
  password: string;
  remember : string;
}

//LOGIN RESPONSE MODEL
export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  token: string;
}

//REGISTER DATA MODEL
export interface AuthRegister {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}


//RESETPASSWORD RESPONSE MODEL
export interface AuthPasswordResetResponse{
  status: string;
}










//RESETPASSWORD DATA MODEL
export interface AuthPasswordResetData {
  token: string;
  email: string;
  password : string;
  password_confirmation: string;
}


//FORGOTPASSWORD DATA MODEL
export interface AuthForgotPasswordData {
  email: string;
}

//FORGOTPASSWORD RESPONSE MODEL
export interface AuthForgotPasswordResponse {
  status : string;
}

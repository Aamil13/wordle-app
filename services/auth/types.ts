type loginData = {
  email: string;
  password: string;
};

type sendOtp = {
  email: string;
  userName: string;
  password: string;
  displayName?: string;
};

type resendOtp = {
  email: string;
};

type VerifyOtp = resendOtp & {
  otp: string;
};

type forgotPassword = {
  email: string;
};

type resetPassord = {
  token: string | string[];
  newPassword: string;
  confirmPassword: string;
};

type isUserNameTaken = {
  userName: string;
};

type isUserEmailTaken = forgotPassword;

export {
  loginData,
  sendOtp,
  resendOtp,
  VerifyOtp,
  forgotPassword,
  resetPassord,
  isUserNameTaken,
  isUserEmailTaken,
};

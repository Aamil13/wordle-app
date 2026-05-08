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

export { loginData, sendOtp, resendOtp, VerifyOtp };

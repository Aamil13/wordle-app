import { client } from "../apiClient";
import { loginData, resendOtp, sendOtp, VerifyOtp } from "./types";

export async function login(data: loginData) {
  const res = await client("/auth/login", { data });
  return res;
}

export async function sendOtpApi(data: sendOtp) {
  const res = await client("/otp/send-otp", { data });
  return res;
}

export async function resendOtpApi(data: resendOtp) {
  const res = await client("/otp/resend-otp", { data });
  return res;
}

export async function verifyOtpAndRegisterApi(data: VerifyOtp) {
  const res = await client("/otp/verify-otp", { data });
  return res;
}

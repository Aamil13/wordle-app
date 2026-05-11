import { client } from "../apiClient";
import {
  forgotPassword,
  isUserEmailTaken,
  isUserNameTaken,
  loginData,
  resendOtp,
  resetPassord,
  sendOtp,
  VerifyOtp,
} from "./types";

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

export async function forgotPasswordApi(data: forgotPassword) {
  const res = await client("/auth/forgot-password", { data });
  return res;
}

export async function resetPasswordApi(data: resetPassord) {
  const res = await client("/auth/reset-password", { data });
  return res;
}

export async function isUserNameTakenApi(data: isUserNameTaken) {
  const res = await client("/auth/is-user-name-taken", { data });
  return res;
}

export async function isUserEmailTakenApi(data: isUserEmailTaken) {
  const res = await client("/auth/is-user-email-taken", { data });
  return res;
}

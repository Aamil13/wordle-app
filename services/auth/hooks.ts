import { useMutation } from "@tanstack/react-query";
import {
  login,
  resendOtpApi,
  sendOtpApi,
  verifyOtpAndRegisterApi,
} from "./api";
import { loginData, resendOtp, sendOtp, VerifyOtp } from "./types";
import { useCustomToast } from "@/hooks/useCustomToast";
import { getErrorMessage } from "@/utils/errorFormat";
import { setUserToken } from "@/storage/userTokenStorage";
import { useAppStore } from "@/store";

export const useLogin = () => {
  const { showPromise, showError } = useCustomToast();
  const store = useAppStore();
  return useMutation({
    mutationFn: (data: loginData) =>
      showPromise(login(data), {
        loading: "Logging in...",
        success: () => "Welcome back!",
        error: (err) => getErrorMessage(err),
      }),
    onSuccess(res: any) {
      console.log("res", res.data);
      setUserToken(res.data.token);
      store.setAuth({ user: res.data.user });
    },
    mutationKey: ["login"],
  });
};

export const useSendOtp = () => {
  const { showError, showSuccess } = useCustomToast();
  return useMutation({
    mutationFn: (data: sendOtp) => sendOtpApi(data),
    mutationKey: ["send-otp"],
    onSuccess: (res: any) => {
      showSuccess(res.message);
    },
    onError(error: any) {
      console.log("err", error);
      showError(error.message);
    },
  });
};

export const useResendOtp = () => {
  const { showError, showSuccess } = useCustomToast();
  return useMutation({
    mutationFn: (data: resendOtp) => resendOtpApi(data),
    mutationKey: ["resend-otp"],
    onSuccess: (res: any) => {
      showSuccess(res.message);
    },
    onError(error: any) {
      showError(error.message);
    },
  });
};

export const useVerifyAndRegisterOtp = () => {
  const { showError, showSuccess } = useCustomToast();
  const store = useAppStore();
  return useMutation({
    mutationFn: (data: VerifyOtp) => verifyOtpAndRegisterApi(data),
    mutationKey: ["verify-and-register"],
    onSuccess: (res: any) => {
      console.log("res", res.data);
      showSuccess(res.message);
      setUserToken(res.data.token);
      store.setAuth({ user: res.data.user });
    },
    onError(error: any) {
      showError(error.message);
    },
  });
};

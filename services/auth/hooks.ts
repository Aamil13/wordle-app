import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordApi,
  isUserEmailTakenApi,
  isUserNameTakenApi,
  login,
  resendOtpApi,
  resetPasswordApi,
  sendOtpApi,
  verifyOtpAndRegisterApi,
} from "./api";
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
import { useCustomToast } from "@/hooks/useCustomToast";
import { getErrorMessage } from "@/utils/errorFormat";
import { setUserToken } from "@/storage/userTokenStorage";
import { useAppStore } from "@/store";

export const useLogin = () => {
  const { showPromise } = useCustomToast();
  const store = useAppStore();
  return useMutation({
    mutationFn: (data: loginData) =>
      showPromise(login(data), {
        loading: "Logging in...",
        success: () => "Welcome back!",
        error: (err) => getErrorMessage(err),
      }),
    onSuccess(res: any) {
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
      showError(getErrorMessage(error));
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
      showSuccess(res.message);
      setUserToken(res.data.token);
      store.setAuth({ user: res.data.user });
    },
    onError(error: any) {
      showError(error.message);
    },
  });
};

export const useForgotPassword = () => {
  const { showError, showSuccess } = useCustomToast();
  return useMutation({
    mutationFn: (data: forgotPassword) => forgotPasswordApi(data),
    mutationKey: ["forgot-password"],
    onSuccess: (res: any) => {
      showSuccess(res.message);
    },
    onError(error: any) {
      showError(error.message);
    },
  });
};

export const useResetPassword = () => {
  const { showError, showSuccess } = useCustomToast();
  return useMutation({
    mutationFn: (data: resetPassord) => resetPasswordApi(data),
    mutationKey: ["reset-password"],
    onSuccess: (res: any) => {
      showSuccess(res.message);
    },
    onError(error: any) {
      showError(error.message);
    },
  });
};

export const useIsUserNameTaken = () => {
  return useMutation({
    mutationFn: (data: isUserNameTaken) => isUserNameTakenApi(data),
    mutationKey: ["is-user-name-taken"],
  });
};

export const useIsUserEmailTaken = () => {
  return useMutation({
    mutationFn: (data: isUserEmailTaken) => isUserEmailTakenApi(data),
    mutationKey: ["is-user-email-taken"],
  });
};

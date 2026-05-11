import { toast } from "@backpackapp-io/react-native-toast";

type ToastOptions = {
  duration?: number;
};

type ToastMessage = {
  title: string;
  description?: string;
};

type ToastInput = string | ToastMessage;

const DEFAULT_OPTIONS: ToastOptions = {
  duration: 3000,
};

export const useCustomToast = (options?: ToastOptions) => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // ✅ Simple formatter (UI only)
  const formatMessage = (msg: ToastInput): string => {
    if (typeof msg === "string") return msg;

    return msg.description ? `${msg.title}\n${msg.description}` : msg.title;
  };

  const showSuccess = (msg: ToastInput) => {
    toast.success(formatMessage(msg), config);
  };

  const showError = (msg: ToastInput) => {
    toast.error(formatMessage(msg), config);
  };

  const showInfo = (msg: ToastInput) => {
    toast(formatMessage(msg), config);
  };

  // ✅ Normalize backend/axios error here ONLY
  const extractError = (err: any): ToastInput => {
    const data = err?.response?.data;

    if (data) {
      const details = data?.details?.length
        ? "\n" + data.details.join("\n")
        : "";

      return {
        title: data.message ?? "Something went wrong",
        description: details || undefined,
      };
    }

    if (err?.message) {
      return err.message;
    }

    return "Something went wrong";
  };

  // ✅ Promise toast
  const showPromise = async <T>(
    promise: Promise<T>,
    {
      loading = "Loading...",
      success = "Success!",
      error = "Something went wrong",
    }: {
      loading?: ToastInput;
      success?: ToastInput | ((data: T) => ToastInput);
      error?: ToastInput | ((err: any) => ToastInput);
    },
  ): Promise<T> => {
    return toast.promise(promise, {
      loading: formatMessage(loading),
      success: (data: T) =>
        formatMessage(typeof success === "function" ? success(data) : success),
      error: (err: any) =>
        formatMessage(
          typeof error === "function" ? error(err) : extractError(err),
        ),
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showPromise,
  };
};

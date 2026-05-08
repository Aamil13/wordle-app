type BackendError = {
  message?: string;
  details?: string[];
};

export const getErrorMessage = (err: any): string => {
  console.log("err", err);

  const data: BackendError = err?.response?.data ?? err;

  // ✅ include details if present
  if (data?.details?.length) {
    return `${data.message}\n${data.details.join("\n")}`;
  }

  // fallback
  if (data?.message) return data.message;

  return "Something went wrong";
};

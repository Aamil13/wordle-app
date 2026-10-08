import OtpAnimation from "@/assets/auth/OTPVerification.json";
import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import FormError from "@/components/atoms/FormError";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import AuthContainer from "@/components/molecules/auth/authContainer";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { useResendTimer } from "@/hooks/useResendTimer";
import {
  useResendOtp,
  useSendOtp,
  useVerifyAndRegisterOtp,
} from "@/services/auth/hooks";
import { getSafeParam } from "@/utils/getSafeParam";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useTheme } from "@/utils/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });
  const { mutate, submittedAt, isPending: isSendOtpPending } = useSendOtp();
  const { mutate: resendOtp } = useResendOtp();

  const {
    mutateAsync: verifyAndRegister,
    isPending,
    data: registerData,
  } = useVerifyAndRegisterOtp();
  const { username, password, email } = useLocalSearchParams();
  const safeUsername = getSafeParam(username);
  const safePassword = getSafeParam(password);
  const safeEmail = getSafeParam(email);
  const { secondsLeft, isActive, trigger } = useResendTimer({
    onPress: () => {
      const payload = {
        email: safeEmail,
        userName: safeUsername,
      };
      resendOtp(payload);
    },
    // onStateChange: (active) => {
    //   setDisableButtons(active);
    // },
  });

  let otp = "";

  const handleSendOtp = () => {
    const payload = {
      userName: safeUsername,
      password: safePassword,
      email: safeEmail,
    };
    mutate(payload);
  };

  const onSubmit = async (formData: any) => {
    const payload = {
      userName: safeUsername,
      password: safePassword,
      email: safeEmail,
      otp: formData.otp,
    };

    try {
      await verifyAndRegister(payload, {
        onSuccess: () => {
          router.replace("/main");
        },
      });
    } catch {
      // Error is already handled by the onError callback in useVerifyAndRegisterOtp
    }
  };
  return (
    <SafeAreaWrapper>
      <KeyboardScreenWrapper>
        <AuthContainer>
          <View style={styles.container}>
            <View style={styles.otpContainer}>
              <AuthAnimation
                height={400}
                source={OtpAnimation}
                loop={false}
                style={{}}
              />
              {/*<OtpInput
                textProps={{ style: { color: theme.text } }}
                onFilled={(code) => (otp = code)}
              />*/}
              {
                submittedAt !== 0 || !isSendOtpPending && (
                  <CustomText align="left" color={theme.text} size={12}>
                    *Click on send button to send the OTP
                  </CustomText>
                )
              }
              <Controller
                control={control}
                name="otp"
                rules={{
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <OtpInput
                    numberOfDigits={6}
                    textProps={{ style: { color: theme.text } }}
                    onFilled={(code) => onChange(code)}
                    disabled={submittedAt !== 0 || !isSendOtpPending }
                  />
                )}
              />
              <FormError error={errors.otp?.message} />
              {submittedAt !== 0 && !isSendOtpPending && (
                <TouchableOpacity
                  onPress={trigger}
                  style={styles.forgotPasswordContainer}
                  disabled={isActive}
                >
                  <CustomText fontFamily="IoSevca">
                    {isActive ? `Resend in ${secondsLeft}s` : "Resend Code"}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
            {submittedAt == 0 || isSendOtpPending ? (
              <CustomButton
                text="Send OTP"
                variant="primary"
                size="large"
                width="100%"
                onPress={handleSendOtp}
                isPending={isSendOtpPending}
              />
            ) : (
              <CustomButton
                text="Verify OTP"
                variant="primary"
                size="large"
                width="100%"
                isDisable={isActive || isPending}
                onPress={handleSubmit(onSubmit)}
                isPending={isPending}
              />
            )}
          </View>
        </AuthContainer>
      </KeyboardScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 22,
    alignItems: "center",
    display: "flex",
  },
  otpContainer: {
    display: "flex",
    gap: 8,
  },
  forgotPasswordContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 16,
  },
});

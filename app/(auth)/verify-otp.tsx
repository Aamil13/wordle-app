import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import { OtpInput } from "react-native-otp-entry";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { CustomText } from "@/components/atoms/customText";
import { useTheme } from "@/utils/useTheme";
import OtpAnimation from "@/assets/auth/OTPVerification.json";
import {
  useResendOtp,
  useSendOtp,
  useVerifyAndRegisterOtp,
} from "@/services/auth/hooks";
import { getSafeParam } from "@/utils/getSafeParam";
import { useResendTimer } from "@/hooks/useResendTimer";
import { Controller, useForm } from "react-hook-form";
import FormError from "@/components/atoms/FormError";

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
  const { mutate, submittedAt } = useSendOtp();
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

    await verifyAndRegister(payload);
  };
  return (
    <SafeAreaWrapper>
      <KeyboardScreenWrapper>
        <AuthContainer>
          <View style={styles.container}>
            <View>
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
                  />
                )}
              />
              <FormError error={errors.otp?.message} />
              {submittedAt !== 0 && (
                <TouchableOpacity
                  onPress={trigger}
                  style={styles.forgotPasswordContainer}
                  disabled={isActive}
                >
                  <CustomText fontFamily="IoSevca">
                    {" "}
                    {isActive ? `Resend in ${secondsLeft}s` : "Resend Code"}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
            {submittedAt == 0 ? (
              <CustomButton
                text="Send OTP"
                variant="primary"
                size="large"
                width="100%"
                onPress={handleSendOtp}
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
  forgotPasswordContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 16,
  },
});

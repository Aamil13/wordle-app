import resetPassword from "@/assets/auth/ResetPassword.json";
import { CustomButton } from "@/components/atoms/Button";
import FloatingInput from "@/components/atoms/FloatingInput";
import FormError from "@/components/atoms/FormError/index";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import AuthContainer from "@/components/molecules/auth/authContainer";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { useResetPassword } from "@/services/auth/hooks";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useTheme } from "@/utils/useTheme";
import { validationRules } from "@/utils/validationRules";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = async (data: any) => {
    const payload = {
      token: data?.token,
      newPassword: data?.password,
      confirmPassword: data?.confirmPassword,
    };
    mutate(payload, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  return (
    <SafeAreaWrapper>
      <KeyboardScreenWrapper>
        <AuthContainer>
          <View style={styles.container}>
            <AuthAnimation height={300} source={resetPassword} loop={false} />

            <Controller
              control={control}
              name="token"
              rules={{
                required: "Reset token is required",
                minLength: {
                  value: 6,
                  message: "Token must be 64 characters",
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
            <FormError error={errors.token?.message as string} />

            <Controller
              control={control}
              name="password"
              rules={validationRules.password}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <FloatingInput
                    label="New Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    isPasswordStrengthMeterShown={true}
                    error={error?.message}
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value: string) => {
                  const password = control._formValues.password;
                  return value === password || "Passwords do not match";
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FloatingInput
                  label="Confirm Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <CustomButton
              text="Reset Password"
              onPress={handleSubmit(onSubmit)}
              width="100%"
              size="large"
              variant="primary"
              isDisable={!!errors.token || !!errors.password || !!errors.confirmPassword || isPending}
              isPending={isPending}
            />
          </View>
        </AuthContainer>
      </KeyboardScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18,
  },
});

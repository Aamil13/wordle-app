import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import FloatingInput from "@/components/atoms/FloatingInput";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import resetPassword from "@/assets/auth/ResetPassword.json";
import { useResetPassword } from "@/services/auth/hooks";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const token = useLocalSearchParams();
  const { control, handleSubmit } = useForm();

  const { mutate } = useResetPassword();

  const onSubmit = async (data: any) => {
    if (token?.token.length < 0) return;
    const payload = {
      token: token?.token,
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
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <FloatingInput
                    label="New Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    isPasswordStrengthMeterShown={true}
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Confirm Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <CustomButton
              text="Reset Password"
              onPress={handleSubmit(onSubmit)}
              width="100%"
              size="large"
              variant="primary"
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

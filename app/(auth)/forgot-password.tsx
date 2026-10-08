import email from "@/assets/auth/Email.json";
import { CustomButton } from "@/components/atoms/Button";
import FloatingInput from "@/components/atoms/FloatingInput";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import AuthContainer from "@/components/molecules/auth/authContainer";
import { useForgotPassword } from "@/services/auth/hooks";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { validationRules } from "@/utils/validationRules";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  });
  const { mutate, isPending } = useForgotPassword();

  const onSubmit = async (data: any) => {
    mutate(data, {
      onSuccess: (res: { data: string }) => {
        router.push(`/reset-password?token=${res.data}`);
      },
    });
  };

  return (
    <SafeAreaWrapper>
      <AuthContainer>
        <View style={styles.container}>
          <AuthAnimation height={400} source={email} loop={false} />
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              rules={validationRules.email}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FloatingInput
                  label="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <CustomButton
              variant="primary"
              width="100%"
              text="Send OTP"
              size="large"
              onPress={handleSubmit(onSubmit)}
              isDisable={!!errors.email || isPending}
              isPending={isPending}
            />
          </View>
        </View>
      </AuthContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18,
    flex: 1,
    justifyContent: "flex-start",
  },
  inputContainer: {},
});

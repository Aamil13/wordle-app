import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import FloatingInput from "@/components/atoms/FloatingInput";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { CustomText } from "@/components/atoms/customText";
import { useTheme } from "@/utils/useTheme";
import register from "@/assets/auth/register.json";
import { validationRules } from "@/utils/validationRules";

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: {
    userName: string;
    email: string;
    password: string;
  }) => {
    // router.push("/verify-otp");
    router.push({
      pathname: "/verify-otp",
      params: {
        username: data.userName,
        password: data.password,
        email: data.email,
      },
    });
  };

  return (
    <SafeAreaWrapper>
      <KeyboardScreenWrapper>
        <AuthContainer>
          <View style={styles.container}>
            <AuthAnimation height={300} source={register} loop={false} />

            <Controller
              control={control}
              name="userName"
              rules={validationRules.required("Username")}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FloatingInput
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="password"
              rules={validationRules.password}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <FloatingInput
                    label="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    isPasswordStrengthMeterShown={true}
                    error={error?.message}
                  />
                </>
              )}
            />

            <CustomButton
              text="Create Account"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              width="100%"
              size="large"
            />

            <CustomText fontFamily="IoSevca" style={{ textAlign: "center" }}>
              Already have an account{" "}
              <CustomText
                style={{ textDecorationLine: "underline" }}
                fontFamily="IoSevca"
                color={theme.yellow}
                onPress={() => router.push("/login")}
              >
                Sign in now
              </CustomText>{" "}
            </CustomText>
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

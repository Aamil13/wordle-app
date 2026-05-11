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
import { useIsUserEmailTaken, useIsUserNameTaken } from "@/services/auth/hooks";

type RegisterFormData = {
  userName: string;
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { mutateAsync, isPending } = useIsUserNameTaken();
  const {
    mutateAsync: isUserEmailTakenMutate,
    isPending: isUserEmailTakenPending,
  } = useIsUserEmailTaken();
  const checkUserName = async (userName: string) => {
    if (!userName) return false;

    try {
      const response: any = await mutateAsync({ userName });
      if (response?.data.isUserNameTaken) {
        setError("userName", {
          type: "manual",
          message: "Username is already taken",
        });

        return false;
      }

      clearErrors("userName");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const checkUserEmail = async (email: string) => {
    if (!email) return false;

    try {
      const response: any = await isUserEmailTakenMutate({ email });
      if (response?.data.isEmailTaken) {
        setError("email", {
          type: "manual",
          message: "Email is already taken",
        });

        return false;
      }

      clearErrors("email");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    // const isAvailable = await checkUserName(data.userName);
    const [isAvailable, isEmailAvailable] = await Promise.all([
      checkUserName(data.userName),
      checkUserEmail(data.email),
    ]);
    if (!isAvailable || !isEmailAvailable) return;

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
              rules={validationRules.required("userName")}
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
                <FloatingInput
                  label="Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  isPasswordStrengthMeterShown={true}
                  error={error?.message}
                />
              )}
            />

            <CustomButton
              text="Create Account"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              width="100%"
              size="large"
              isDisable={!!errors.userName || isPending}
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
              </CustomText>
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

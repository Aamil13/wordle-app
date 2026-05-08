import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FloatingInput from "@/components/atoms/FloatingInput";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { useTheme } from "@/utils/useTheme";
import { CustomText } from "@/components/atoms/customText";
import loginAnimation from "@/assets/auth/Login.json";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <SafeAreaWrapper>
      <KeyboardScreenWrapper>
        <AuthContainer>
          <View style={styles.container}>
            <AuthAnimation source={loginAnimation} height={300} />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Email"
                  value={value}
                  keyboardType="email-address"
                  onChangeText={onChange}
                />
              )}
            />

            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <FloatingInput
                    label="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <View style={styles.forgotPasswordContainer}>
                <CustomText
                  onPress={() => router.push("/forgot-password")}
                  fontFamily="IoSevca"
                >
                  Forgot Password
                </CustomText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                variant="primary"
                text="Login"
                width="100%"
                onPress={handleSubmit(onSubmit)}
                size="large"
              />

              <CustomText fontFamily="IoSevca">
                Don&apos;t have an account yet{" "}
                <CustomText
                  style={{ textDecorationLine: "underline" }}
                  fontFamily="IoSevca"
                  color={theme.yellow}
                  onPress={() => router.push("/register")}
                >
                  Sign up now
                </CustomText>{" "}
              </CustomText>
            </View>
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
    flex: 1,
  },
  passwordContainer: {
    display: "flex",
  },
  forgotPasswordContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    paddingBottom: 24,
  },
});

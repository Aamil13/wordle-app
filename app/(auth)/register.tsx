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
export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { control, handleSubmit, watch } = useForm();

  const password = watch("password");

  const onSubmit = async (data: any) => {
    console.log(data);

    router.push("/verify-otp");
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
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <FloatingInput
                    label="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    isPasswordStrengthMeterShown={true}
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

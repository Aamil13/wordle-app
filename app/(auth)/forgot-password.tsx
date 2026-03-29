import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import FloatingInput from "@/components/atoms/FloatingInput";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import email from "@/assets/auth/Email.json";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);

    router.push("/verify-otp");
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
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <CustomButton
              variant="primary"
              width="100%"
              text="Send OTP"
              size="large"
              onPress={handleSubmit(onSubmit)}
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

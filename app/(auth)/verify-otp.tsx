import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CustomButton } from "@/components/atoms/Button";
import AuthContainer from "@/components/molecules/auth/authContainer";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import { OtpInput } from "react-native-otp-entry";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import { CustomText } from "@/components/atoms/customText";
import { useTheme } from "@/utils/useTheme";
import OtpAnimation from "@/assets/auth/OTPVerification.json";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const theme = useTheme();
  let otp = "";

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
              <OtpInput
                textProps={{ style: { color: theme.text } }}
                onFilled={(code) => (otp = code)}
              />
              <View style={styles.forgotPasswordContainer}>
                <CustomText fontFamily="IoSevca">Resend Code</CustomText>
              </View>
            </View>
            <CustomButton
              text="Verify OTP"
              variant="primary"
              size="large"
              width="100%"
              onPress={() => {
                console.log(otp);

                router.push("/reset-password");
              }}
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

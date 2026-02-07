import { CustomButton } from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import { CustomText } from "@/components/atoms/customText";
import { Separator } from "@/components/atoms/Separator";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [step, setStep] = useState<"email" | "sendCode" | "oauth">("email");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const { setActive, signIn } = useSignIn();

  const handleGoogleSignIn = async () => {
    try {
      const result = await startSSOFlow({
        strategy: "oauth_google",
        // Optional: Specify redirect URL
        // redirectUrl: "your-app-scheme://oauth-callback",
      });

      if (result.createdSessionId) {
        await setActive!({
          session: result.createdSessionId,
          navigate: async ({ session }) => {
            router.replace("/main");
          },
        });
      } else {
        console.log("Sign-in incomplete, additional steps may be needed");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await startSSOFlow({
        strategy: "oauth_facebook",
      });
      if (result.createdSessionId) {
        console.log("Successfully signed in!");
        await setActive!({ session: result.createdSessionId });
        router.replace("/main");
      } else {
        console.log("Sign-in incomplete, additional steps may be needed");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleEmailSubmit = async () => {
    setError(null);
    try {
      await signIn!.create({
        identifier: email,
      });

      setStep("sendCode");
    } catch (err: any) {
      console.log(err);

      setError(err.errors?.[0]?.message ?? "Something went wrong");
    }
  };
  const handleOtpSend = async () => {
    setError(null);
    try {
      const factor =
        signIn &&
        signIn?.supportedFirstFactors &&
        signIn?.supportedFirstFactors.find((f) => f.strategy === "email_code");

      if (!factor) {
        throw new Error("No supported factor found for email_code strategy");
      }
      await signIn!.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: factor.emailAddressId,
      });
      setStep("oauth");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Something went wrong");
    }
  };

  const handlePasswordSubmit = async () => {
    setError(null);
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "email_code",
        code: password,
      });

      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.replace("/main");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Invalid password");
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.headerTextContainer}>
          <CustomText>Login or create an account</CustomText>
          <CustomText size={12} style={{ textAlign: "center" }}>
            By continuing you agree to our Terms of Service and Privacy Policy.
          </CustomText>
        </View>
        {step === "email" && (
          <>
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              isRounded={true}
            />

            <CustomButton
              icon={<Ionicons name="mail-open-outline" size={24} />}
              text="Continue with Email"
              onPress={handleEmailSubmit}
            />
            <CustomText size={14} style={{ textAlign: "center", marginTop: 2 }}>
              {error}
            </CustomText>
          </>
        )}
        {step === "sendCode" && (
          <>
            <CustomButton
              icon={<Ionicons name="mail-open-outline" size={24} />}
              text={`send Code to email`}
              onPress={handleOtpSend}
            />
            <CustomText size={14} style={{ textAlign: "center", marginTop: 2 }}>
              {error}
            </CustomText>
          </>
        )}
        {step === "oauth" && (
          <>
            <CustomInput
              label="Otp"
              placeholder={`Enter the code sent to email`}
              value={password}
              onChangeText={setPassword}
              error={emailError}
              isRounded={true}
              secureTextEntry
            />

            <CustomButton
              icon={<Ionicons name="mail-open-outline" size={24} />}
              text="Continue with Otp"
              onPress={handlePasswordSubmit}
            />
            <CustomText size={14} style={{ textAlign: "center", marginTop: 2 }}>
              {error}
            </CustomText>
          </>
        )}
        <Separator />
        <View style={styles.signInContainer}>
          <CustomButton
            icon={<Ionicons name="logo-google" size={24} />}
            text="Sign in with Google"
            onPress={handleGoogleSignIn}
          />
          <CustomButton
            icon={<Ionicons name="logo-facebook" size={24} />}
            text="Sign in with Facebook"
            onPress={handleFacebookSignIn}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTextContainer: {
    gap: 8,
    marginTop: 20,
    marginBottom: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  signInContainer: {
    marginTop: 20,
    gap: 15,
    display: "flex",
    flexDirection: "column",
  },
});

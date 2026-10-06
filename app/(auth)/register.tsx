import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import FloatingInput from "@/components/atoms/FloatingInput";
import PlayfulSwitch from "@/components/atoms/PlayfulSwitch";
import AuthAnimation from "@/components/molecules/auth/authAnimation";
import AuthContainer from "@/components/molecules/auth/authContainer";
import KeyboardScreenWrapper from "@/components/molecules/KeyboardScreenWrapper";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useTheme } from "@/utils/useTheme";

import register from "@/assets/auth/register.json";
import { useIsUserEmailTaken, useIsUserNameTaken } from "@/services/auth/hooks";
import { validationRules } from "@/utils/validationRules";

type RegisterFormData = {
  userName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
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
  } = useForm<RegisterFormData>({
    defaultValues: {
      acceptTerms: false,
    },
  });

  const openTermsOfService = () => {
    router.push({
      pathname: "/legal-document" as any,
      params: { type: "terms" },
    });
  };

  const openPrivacyPolicy = () => {
    router.push({
      pathname: "/legal-document" as any,
      params: { type: "privacy" },
    });
  };

  const { mutateAsync, isPending } = useIsUserNameTaken();
  const {
    mutateAsync: isUserEmailTakenMutate,
    isPending: isUserEmailTakenPending,
  } = useIsUserEmailTaken();
  const checkUserName = async (userName: string) => {
    userName = userName.trim();
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
        termsAccepted: data.acceptTerms.toString(),
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
              rules={{
                ...validationRules.required("userName"),
                validate: (val: string) =>
                  !/\s/.test(val.trim()) || "Username must be a single word with no spaces",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FloatingInput
                  label="Username"
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/\s/g, ""))}
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

            <Controller
              control={control}
              name="acceptTerms"
              rules={validationRules.acceptTerms}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.termsContainer}>
                  <PlayfulSwitch
                    value={value}
                    onValueChange={onChange}
                    size="small"
                  />
                  <View style={styles.termsTextContainer}>
                    <View style={styles.termsTextWrapper}>
                      <CustomText size={12}>
                        I agree to the{" "}
                      </CustomText>
                      <CustomText
                        style={styles.linkText}
                        color={theme.yellow}
                        onPress={openTermsOfService}
                        size={12}
                      >
                        Terms of Service
                      </CustomText>
                      <CustomText size={12}>
                        {" "}and{" "}
                      </CustomText>
                      <CustomText
                        style={styles.linkText}
                        color={theme.yellow}
                        onPress={openPrivacyPolicy}
                        size={12}
                      >
                        Privacy Policy
                      </CustomText>
                    </View>
                    {error && (
                      <CustomText style={styles.errorText} size={10} color="red">
                        {error.message}
                      </CustomText>
                    )}
                  </View>
                </View>
              )}
            />

            <CustomButton
              text="Create Account"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              width="100%"
              size="large"
              isDisable={!!errors.userName || !!errors.acceptTerms || !!errors.email || isPending}
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    justifyContent: "center",
  },
  termsTextContainer: {
    flex: 1,
  },
  termsTextWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  termsText: {
    flex: 1,
    flexWrap: "wrap",
  },
  linkText: {
    textDecorationLine: "underline",
  },
  errorText: {
    marginTop: 4,
  },
});

import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import AboutBottomSheet from "@/components/organisms/aboutBottomSheet";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { SignedIn, SignedOut, useAuth, useClerk } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";

const Main = () => {
  const aboutBottomSheetRef = useRef<BottomSheetModal>(null);
  const { signOut } = useClerk();
  const { isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }
  const handlePresentAboutModalPress = () => {
    if (aboutBottomSheetRef.current) {
      try {
        aboutBottomSheetRef.current.present();

        setTimeout(() => {
          if (aboutBottomSheetRef.current) {
            aboutBottomSheetRef.current.snapToIndex(0);
          }
        }, 50);
      } catch (error) {
        console.error("Error presenting modal:", error);
      }
    } else {
      console.log("ERROR: Ref is null!");
    }
  };

  return (
    <>
      <SafeAreaWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <LottieView
              source={require("../assets/onboarding/W.json")}
              style={{ width: 250, height: 250 }}
              progress={100}
            />
            <CustomText size={28}>Wordle</CustomText>
            <CustomText style={{ textAlign: "center" }}>
              Get 6 chances to guess a 5-letter word.
            </CustomText>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              text={"Play"}
              onPress={() => router.push("/game")}
              initialRotation={-10}
              variant="primary"
            />
            <SignedOut>
              <Link href="/login" asChild>
                <CustomButton
                  text={"Sign In"}
                  onPress={() => {}}
                  initialRotation={4}
                  variant="success"
                />
              </Link>
            </SignedOut>
            <SignedIn>
              {/* <Link href="/login" asChild> */}
              <CustomButton
                text={"Sign Out"}
                onPress={() => signOut()}
                initialRotation={4}
                variant="success"
              />
              {/* </Link> */}
            </SignedIn>
            <CustomButton
              text={"About"}
              onPress={handlePresentAboutModalPress}
              initialRotation={-5}
            />
          </View>

          <View style={styles.footer}>
            <CustomText size={12}>10 Dec 2025</CustomText>
            <CustomText size={12}>Made By: Mohd Aamil Shafi</CustomText>
          </View>
        </View>
      </SafeAreaWrapper>
      <AboutBottomSheet ref={aboutBottomSheetRef} />
    </>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",

    gap: 40,
  },
  footer: {
    display: "flex",
    gap: 10,

    alignItems: "center",
  },
});

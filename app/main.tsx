import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import AboutBottomSheet from "@/components/organisms/aboutBottomSheet";
import { AppBottomSheet } from "@/components/organisms/appBottomSheet";
import SettingsPanel from "@/components/organisms/settingsPanel";
import { useAudio } from "@/context/audio";
import {
  getTotalWordCount,
  saveWordsToDatabase,
} from "@/localDb/pushToSqlLite";
import {
  loadSettingsFromDb,
  saveSettingsToDb,
} from "@/localDb/settingsService";
import { setOnboarding } from "@/storage/onboardStorage";
import { useAppStore } from "@/store";
import { presentBottomSheet } from "@/utils/presentBottomSheet";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { SignedIn, SignedOut, useAuth, useClerk } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

const Main = () => {
  const aboutBottomSheetRef = useRef<BottomSheetModal>(null);
  const settingsRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const { signOut } = useClerk();
  const { isLoaded } = useAuth();
  const { play, stop } = useAudio();

  const bgEnabled = useAppStore((s) => s.bgEnabled);
  const toggleBg = useAppStore((s) => s.toggleBg);
  const isHydrated = useAppStore((s) => s.isHydrated);

  /* -------------------- Handlers -------------------- */

  const handleToggleBg = useCallback(() => {
    toggleBg();
    saveSettingsToDb();
  }, [toggleBg]);

  const handlePlay = useCallback(() => {
    router.push("/game");
  }, [router]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handlePresentAboutModalPress = () => {
    presentBottomSheet(aboutBottomSheetRef);
  };
  const handlePresentSettingsModalPress = () => {
    presentBottomSheet(settingsRef);
  };

  const getTotalWords = () => {
    console.log(getTotalWordCount());
  };

  /* -------------------- Effects -------------------- */

  // Load onboarding + settings once
  useEffect(() => {
    const initialize = async () => {
      await setOnboarding("true");
      loadSettingsFromDb();
    };

    initialize();
  }, []);

  // Handle background audio
  useEffect(() => {
    if (!isHydrated) return;

    bgEnabled ? play() : stop();
  }, [bgEnabled, isHydrated, play, stop]);

  if (!isLoaded) return null;

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
              Think fast. Guess smart.
            </CustomText>
          </View>
          <View style={styles.buttonContainer}>
            {/*<CustomButton
              text={"total"}
              onPress={() => getTotalWords()}
              initialRotation={-10}
              variant="primary"
            />*/}
            {/*<CustomButton
              text={"toggle"}
              onPress={toggleBg}
              initialRotation={-10}
              variant={bgEnabled ? "primary" : "danger"}
            />*/}
            <CustomButton
              text={"Play"}
              onPress={handlePlay}
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
                onPress={handleSignOut}
                initialRotation={4}
                variant="success"
              />
              {/* </Link> */}
            </SignedIn>
            {/*<CustomButton
              text={"About"}
              onPress={handlePresentAboutModalPress}
              initialRotation={-5}
            />*/}
            <CustomButton
              text={"Settings"}
              onPress={handlePresentSettingsModalPress}
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
      <AppBottomSheet ref={settingsRef} snapPoints={["60%"]}>
        <SettingsPanel onClose={() => settingsRef.current?.dismiss()} />
      </AppBottomSheet>
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

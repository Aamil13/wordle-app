import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import AboutBottomSheet from "@/components/organisms/aboutBottomSheet";
import { AppBottomSheet } from "@/components/organisms/appBottomSheet";
import SettingsPanel from "@/components/organisms/settingsPanel";
import { useAudio } from "@/context/audio";
import { useNetwork } from "@/context/network";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useForceUpdate } from "@/hooks/useForceUpdate";
import { getTotalWordCount, saveWordsToDatabase } from "@/localDb/pushToSqlLite";
import { loadSettingsFromDb } from "@/localDb/settingsService";
import { useGetUserData } from "@/services/user/hooks";
import { useGetAllWords } from "@/services/wordle/hooks";
import { WordsApiResponse } from "@/services/wordle/types";
import { deleteUserToken, getUserToken } from "@/storage/userTokenStorage";
import { useAppStore } from "@/store";
import { presentBottomSheet } from "@/utils/presentBottomSheet";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

// Memoized footer component
const Footer = memo(() => (
  <View style={styles.footer}>
    {/*<CustomText size={12}>10 Dec 2025</CustomText>*/}
    <CustomText size={12}>Made By: Mohd Aamil Shafi</CustomText>
  </View>
));
Footer.displayName = "Footer";

const Main = () => {
  const aboutBottomSheetRef = useRef<BottomSheetModal>(null);
  const settingsRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { play, stop } = useAudio();
  const { isConnected } = useNetwork();
  const { showError, showSuccess, showInfo } = useCustomToast();
  const wordleDataCount = getTotalWordCount();
  const [isToken, setIsToken] = useState(false);

  const { data, isFetching } = useGetUserData(isToken);
  const { data: wordsData, isFetching: isWordsFetching, isError: isWordsError, refetch: refetchWords } = useGetAllWords(wordleDataCount < 1) as { data: WordsApiResponse | undefined; isFetching: boolean; isError: boolean; refetch: () => void };
  const { shouldUpdate } = useForceUpdate();

  // Zustand selectors
  const bgEnabled = useAppStore((s) => s.bgEnabled);
  const isHydrated = useAppStore((s) => s.isHydrated);
  // const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const clearAuth = useAppStore((s) => s.clearAuth);
  const setAuth = useAppStore((s) => s.setAuth);


  /* -------------------- Handlers -------------------- */

  const handlePlay = useCallback((mode: "daily" | "infinite" | "timeattack") => {
    if ((mode === "daily" || mode === "timeattack") && !isConnected) {
      showError("Internet connection required for this mode");
      return;
    }
    router.push(`/game?mode=${mode}`);
  }, [isConnected, showError]);

  const handleSignOut = useCallback(() => {
    clearAuth();
    deleteUserToken();
    setIsToken(false);
  }, [clearAuth]);

  const handlePresentSettingsModalPress = useCallback(() => {
    presentBottomSheet(settingsRef);
  }, []);

  /* -------------------- Effects -------------------- */

  // Initial load: onboarding, settings, token check
  useEffect(() => {
    const initialize = async () => {
      // Don't set onboarding here - it's already handled in _layout.tsx
      loadSettingsFromDb();

      const token = await getUserToken();
      if (token && token.length > 0 ) {
        setIsToken(true);
      }
    };

    initialize();
  }, []);

  // Update auth state when data arrives
  useEffect(() => {
    if (data?.data) {
      setAuth({ user: data.data });
    }
  }, [data, setAuth]);

  // Handle background audio
  useEffect(() => {
    if (!isHydrated) return;

    if (bgEnabled) {
      play();
    } else {
      stop();
    }
  }, [bgEnabled, isHydrated, play, stop]);

  // Save words to SQLite when API returns data, show toast on success/failure
  useEffect(() => {
    if (wordsData?.data && wordsData.data.length > 0) {
      saveWordsToDatabase(wordsData.data);
      showSuccess("Words synced — Infinite mode is ready!");
    }
  }, [wordsData]);

  useEffect(() => {
    if (isWordsError) {
      showError("Failed to load words. Tap Infinite to retry.");
    }
  }, [isWordsError]);

  // Navigate to force update screen if needed
  useEffect(() => {
    if (shouldUpdate) {
      router.push("/force-update");
    }
  }, [shouldUpdate, router]);

  return (
    <>
      <SafeAreaWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <LottieView
              source={require("../assets/onboarding/w.json")}
              style={styles.lottie}
              progress={100}
            />
            <CustomText size={28}>Wordle</CustomText>
            <CustomText style={styles.tagline}>
              Think fast. Guess smart.
            </CustomText>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              text="Daily Challenge"
              onPress={() => handlePlay("daily")}
              initialRotation={-10}
              variant="primary"
              warningType="err"
              message={ !isToken ? "Please sign in to play Daily Challenge" : "You've already played today"}
              isWarn={data?.data?.user?.dailyPlayedToday || !isToken}
              // isDisable={data?.data?.user?.dailyPlayedToday}
            />
              <CustomButton
              text="Infinite"
              onPress={() => {
                if (wordleDataCount < 1) {
                  refetchWords();
                  showInfo("Fetching words, please wait…");
                  return;
                }
                handlePlay("infinite");
              }}
              initialRotation={-10}
              variant="default"
              isDisable={isWordsFetching && wordleDataCount < 1}
              isPending={isWordsFetching && wordleDataCount < 1}
              isWarn={wordleDataCount < 1 && !isWordsFetching}
              warningType="warn"
              message={isWordsError ? "Couldn't load words. Tap to retry." : "Still loading words, please wait…"}
            />
              {/* <CustomButton
              text="TimeAttack"
              onPress={() => handlePlay("timeattack")}
              initialRotation={-10}
              variant="primary"
              isDisable={wordleDataCount < 1}
            /> */}

            {!isToken ? (
              <Link href="/login" asChild>
                <CustomButton
                  text="Sign In"
                  onPress={() => {}}
                  initialRotation={4}
                  variant="success"
                  isDisable={isFetching}
                  isPending={isFetching}
                />
              </Link>
            ) : (
              <CustomButton
                text="Sign Out"
                onPress={handleSignOut}
                initialRotation={4}
                variant="success"
              />
            )}

            <CustomButton
              text="Settings"
              onPress={handlePresentSettingsModalPress}
              initialRotation={-5}
            />
          </View>

          <Footer />
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
    flex: 1, 
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  tagline: {
    textAlign: "center",
  },
  buttonContainer: {
    gap: 40,
  },
  footer: {
    gap: 10,
    alignItems: "center",
  },
});

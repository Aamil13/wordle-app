import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import confetti from "@/assets/game-over/Confetti.json";
import confettiBG from "@/assets/game-over/confetti on transparent background.json";
import lose from "@/assets/game-over/you lose.json";
import SessionDetails from "@/components/molecules/sessionDetails";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSounds } from "@/gameLogic/useSounds";
import { useEffect } from "react";
const GameOverScreen = () => {
  const router = useRouter();
  const { playTrumpet, playFail, isGameOverLoaded, loadGameOverSounds } =
    useSounds();

  const { win } = useLocalSearchParams<{
    win: string;
  }>();
  const isLose = win === "false";

  useEffect(() => {
    loadGameOverSounds();
  }, []);

  useEffect(() => {
    if (!isGameOverLoaded) return;

    if (win !== "false") {
      playTrumpet();
    } else {
      playFail();
    }
  }, [isGameOverLoaded]);
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {!isLose && (
          <View style={styles.confettiBG}>
            <LottieView
              source={confettiBG}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}

        {isLose ? (
          <LottieView
            source={lose}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
        ) : (
          <LottieView
            source={confetti}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
        )}

        <CustomText size={18}>
          {isLose ? "Better Luck Next Time" : "WOW YOU WON!"}
        </CustomText>
        <SessionDetails />
        <CustomButton
          text={"Back to main menu"}
          onPress={() => router.replace("/main")}
          initialRotation={4}
          variant="success"
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default GameOverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  confettiBG: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

import confetti from "@/assets/game-over/Confetti.json";
import confettiBG from "@/assets/game-over/confetti on transparent background.json";
import lose from "@/assets/game-over/you lose.json";
import { CustomButton } from "@/components/atoms/Button";
import { CustomText } from "@/components/atoms/customText";
import SessionDetails from "@/components/molecules/sessionDetails";
import { useSounds } from "@/gameLogic/useSounds";
import { useGetStatsByMode, useUpdateInfiniteSession, useUpdateStats } from "@/services/stats/hooks";
import { GameModeEnum } from "@/services/stats/types";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
const GameOverScreen = () => {
  const router = useRouter();
  const { playTrumpet, playFail, isGameOverLoaded, loadGameOverSounds } =
    useSounds();
    

  const { win, mode = "infinite", guesses,correctGuesses } = useLocalSearchParams<{
    win: string;
    mode?: string;
    guesses?: string;
    correctGuesses?: string;
  }>();
  const isLose = win === "false";
  const gameMode = mode === "daily" ? GameModeEnum.DAILY : GameModeEnum.INFINITE;
  const { data: stats, isPending } = useGetStatsByMode(gameMode);
  const updateInfiniteSession = useUpdateInfiniteSession();
  const updateStats = useUpdateStats();

  useEffect(() => {
    loadGameOverSounds();
  }, []);

  useEffect(() => {
    if (!isGameOverLoaded) return;

    if (win !== "false") {
      playTrumpet();
      if (mode === "infinite" ) {
      updateInfiniteSession.mutate({ correctGuesses: correctGuesses ? parseInt(correctGuesses) : 1 });
    }
    if (mode === "daily") {
      updateStats.mutate({
        gameMode: GameModeEnum.DAILY,
        result: {
          won: !isLose,
          guesses: guesses ? parseInt(guesses) : 1,
        },
      });
    }
    } else {
      playFail();
      if (mode === "infinite" ) {
      updateInfiniteSession.mutate({correctGuesses: correctGuesses ? parseInt(correctGuesses) : 1 });
    }
    if (mode === "daily") {
      updateStats.mutate({
        gameMode: GameModeEnum.DAILY,
        result: {
          won: !isLose,
          guesses: guesses ? parseInt(guesses) : 1,
        },
      });
    }
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
        <SessionDetails stats={stats} isPending={isPending} />
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

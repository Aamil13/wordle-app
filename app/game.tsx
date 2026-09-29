import { CustomText } from "@/components/atoms/customText";
import CustomKeyboard from "@/components/molecules/customKeyboard";
import AnimatedCell from "@/components/molecules/game/animatedCell";
import AnimatedRow from "@/components/molecules/game/animatedRow";
import { useNetwork } from "@/context/network";
import { useGame } from "@/gameLogic/useGame";
import { useHaptics } from "@/gameLogic/useHaptics";
import { useSounds } from "@/gameLogic/useSounds";
import {
  getRandomWords,
  incrementWordShownCount,
  syncPendingPlayedUpdates
} from "@/localDb/pushToSqlLite";
import { useGetDailyWord } from "@/services/daily/hooks";
import { useUpdatePlayedWord } from "@/services/wordle/hooks";
import { IWordles } from "@/services/wordle/types";
import { getUserToken } from "@/storage/userTokenStorage";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const GameScreen = () => {
  const navigate = useRouter();
  const { mode = "infinite" } = useLocalSearchParams<{ mode?: string }>();
  const { isConnected } = useNetwork();
  const [hasToken, setHasToken] = useState(false);

  // Fetch words based on mode
  // const wordsQuery = useGetRandomWord(mode === "daily");
  const wordsQuery = useGetDailyWord(mode === "daily");
  const updatePlayedWord = useUpdatePlayedWord();

 

  // Check for token on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = await getUserToken();
      setHasToken(!!token);
    };
    checkToken();
  }, []);


  // Sync pending updates when coming online and token is available
  useEffect(() => {
    if (isConnected && mode === "infinite" && hasToken) {
      syncPendingPlayedUpdates(async (id, data) => {
        await updatePlayedWord.mutateAsync({ id, data });
      });
    }
  }, [isConnected, mode, hasToken]);





  const words = React.useMemo(() => {
    if (mode === "daily") {
      // For daily mode, use API-fetched single word
      if (wordsQuery.data?.data) {
        const wordData = wordsQuery.data.data as IWordles;
        return [{ word: wordData.word, hint: wordData.hint }];
      }
      return [];
    } else {
      // For infinite mode, use local DB
      const fetchedWords = getRandomWords(3);
      // Transform to WordItem type
      const transformedWords = fetchedWords.map((word) => ({
        word: word.word,
        hint: word.hint,
      }));
      // Increment noOfTimesShown for the initial words
      fetchedWords.forEach((word) => {
        if (word._id) {
          incrementWordShownCount(word._id);
        }
      });
      return transformedWords;
    }
  }, [mode, wordsQuery.data]);

  const { state, addLetter, backspace, submit } = useGame({
    words,
    maxFails: 3,
    mode,
  });



  const { loadGameSounds, playSuccess, playWarning, playKeyPress } =
    useSounds();
  const { light, success, error } = useHaptics();

  const handleKeyPress = async (key: string) => {
    playKeyPress();
    await light();
    if (key === "ENTER") return submit();
    if (key === "BACKSPACE") return backspace();
    addLetter(key);
  };

  useEffect(() => {
    if (state.isWin) navigate.replace(`/game-over?win=true&mode=${mode}&guesses=${4 - state.failCount}&correctGuesses=${state.correctGuesses}`);
    if (state.isLose) navigate.replace(`/game-over?win=false&mode=${mode}&guesses=${4 - state.failCount}&correctGuesses=${state.correctGuesses}`);
  }, [state.isWin, state.isLose, mode, ]);

  useEffect(() => {
    loadGameSounds();
  }, []);

  useEffect(() => {
    // if (state.cellAnimation.type === "flip") {
    //   playFlip();
    // }

    if (state.cellAnimation.type === "success") {
      success();
      playSuccess();
    }

    if (state.rowAnimation.type === "shake") {
      error();
      playWarning();
    }
  }, [state.cellAnimation, state.rowAnimation]);

  // Show loading state for daily mode while fetching
  if (mode === "daily" && wordsQuery.isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <CustomText style={styles.loadingText}>Loading daily words...</CustomText>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Show error state for daily mode
  if (mode === "daily" && wordsQuery.isError) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <CustomText style={styles.errorText}>Failed to load daily words. Please try again.</CustomText>
        </View>
      </SafeAreaWrapper>
    );
  }



  // Show loading state for daily mode when words are empty but query is not yet complete
  if (mode === "daily" && words.length === 0) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <CustomText style={styles.loadingText}>Loading daily words...</CustomText>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!state.rows.length || words.length === 0) return null;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.failCountContainer}>
          <CustomText>{state.failCount}</CustomText>
        </View>

        <View style={styles.rowsContainer}>
          {state.rows.map((row, rowIndex) => (
            <AnimatedRow
              key={rowIndex}
              animation={
                state.rowAnimation.rowIndex === rowIndex
                  ? state.rowAnimation.type
                  : "idle"
              }
            >
              <View style={styles.cellContainer}>
                {row.map((cell, cellIndex) => (
                  <AnimatedCell
                    key={`${rowIndex}-${cellIndex}`}
                    letter={cell}
                    state={state.letterStates[rowIndex]?.[cellIndex] ?? "empty"}
                    index={cellIndex}
                    animation={
                      state.cellAnimation?.rowIndex === rowIndex
                        ? state.cellAnimation.type
                        : "idle"
                    }
                  />
                ))}
              </View>
            </AnimatedRow>
          ))}
        </View>

        <CustomText>{(state.words || words)[state.curRow]?.hint}</CustomText>

        <CustomKeyboard
          {...state.keyboardColors}
          onKeyPressed={handleKeyPress}
          backSpaceDanger={state.backspaceDanger || false}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    position: "relative",
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  failCountContainer: {
    position: "absolute",
    right: 10,
    top: -30,
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 360,
    padding: 4,

  },
  rowsContainer: {
    gap: 16,
  },
  cellContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
});

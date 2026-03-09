import { CustomText } from "@/components/atoms/customText";
import CustomKeyboard from "@/components/molecules/customKeyboard";
import AnimatedCell from "@/components/molecules/game/animatedCell";
import AnimatedRow from "@/components/molecules/game/animatedRow";
import { useGame } from "@/gameLogic/useGame";
import { useHaptics } from "@/gameLogic/useHaptics";
import { useSounds } from "@/gameLogic/useSounds";
import { getRandomWords } from "@/localDb/pushToSqlLite";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const GameScreen = () => {
  const navigate = useRouter();

  const words = React.useMemo(() => getRandomWords(3), []);

  const { state, addLetter, backspace, submit } = useGame({
    words,
    maxFails: 3,
  });

  const { loadGameSounds, playSuccess, playWarning } = useSounds();
  const { light, success, error } = useHaptics();

  const handleKeyPress = async (key: string) => {
    await light();
    if (key === "ENTER") return submit();
    if (key === "BACKSPACE") return backspace();
    addLetter(key);
  };

  useEffect(() => {
    if (state.isWin) navigate.replace("/game-over?win=true");
    if (state.isLose) navigate.replace("/game-over?win=false");
  }, [state.isWin, state.isLose]);

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

  if (!state.rows.length) return null;

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

        <CustomText>{words[state.curRow]?.hint}</CustomText>

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
    marginTop: 10,
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

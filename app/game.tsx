import { CustomText } from "@/components/atoms/customText";
import CustomKeyboard from "@/components/molecules/customKeyboard";
import AnimatedCell from "@/components/molecules/game/animatedCell";
import AnimatedRow from "@/components/molecules/game/animatedRow";
import { useGame } from "@/gameLogic/useGame";
import { getRandomWords } from "@/localDb/pushToSqlLite";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const GameScreen = () => {
  const navigate = useRouter();

  const words = React.useMemo(() => getRandomWords(3), []);

  const { state, addLetter, backspace, submit } = useGame({
    words,
    maxFails: 3,
  });

  const handleKeyPress = (key: string) => {
    if (key === "ENTER") return submit();
    if (key === "BACKSPACE") return backspace();
    addLetter(key);
  };

  useEffect(() => {
    if (state.isWin) navigate.navigate("/game-over?win=true");
    if (state.isLose) navigate.navigate("/game-over?win=false");
  }, [state.isWin, state.isLose]);

  if (!state.rows.length) return null;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.failCountContainer}>
          <CustomText>{state.failCount}</CustomText>
        </View>

        <View style={styles.rowsContainer}>
          {/*{state.rows.map((row, rowIndex) => (
            <AnimatedRow
              key={rowIndex}
              triggerShake={rowIndex === state.curRow}
            >
              <View style={styles.cellContainer}>
                {row.map((cell, cellIndex) => (
                  <AnimatedCell
                    key={`${rowIndex}-${cellIndex}`}
                    letter={cell}
                    state={state.letterStates[rowIndex]?.[cellIndex] ?? "empty"}
                    index={cellIndex}
                    triggerFlip={state.evaluatedRows[rowIndex]}
                  />
                ))}
              </View>
            </AnimatedRow>
          ))}*/}

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

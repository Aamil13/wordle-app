import { CustomText } from "@/components/atoms/customText";
import { GameCell } from "@/components/atoms/gameCell";
import CustomKeyboard from "@/components/molecules/customKeyboard";
import { wordDatabase } from "@/data/newWordDataWithHints";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";

import React, { useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

type CellState = "green" | "yellow" | "gray" | "empty";

const GameScreen = () => {
  const [rows, setRows] = useState<string[][]>([]);
  const [letterStates, setLetterStates] = useState<CellState[][]>([]);
  const [evaluatedRows, setEvaluatedRows] = useState<boolean[]>([]);
  const [words, setWords] = useState<{ word: string; hint: string }[]>([]);

  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const colRef = useRef(curCol);
  const setCurCol = (val: number) => {
    colRef.current = val;
    _setCurCol(val);
  };

  // 🎲 Create game
  const createGame = () => {
    const rowCount = Math.floor(Math.random() * 6) + 1;

    const selectedWords = Array.from(
      { length: rowCount },
      () => wordDatabase[Math.floor(Math.random() * wordDatabase.length)]
    );

    return selectedWords;
  };

  // 🚀 Init
  useLayoutEffect(() => {
    const selectedWords = createGame();

    setWords(selectedWords);
    setRows(
      selectedWords.map((w) => Array.from({ length: w.word.length }, () => ""))
    );
    setLetterStates(
      selectedWords.map((w) =>
        Array.from({ length: w.word.length }, () => "empty")
      )
    );
    setEvaluatedRows(selectedWords.map(() => false));
  }, []);

  // ⌨️ Keyboard input
  const handleKeyPress = (key: string) => {
    if (curRow >= rows.length) return;

    const newRows = rows.map((r) => [...r]);

    if (key === "ENTER") {
      checkWord();
      return;
    }

    if (key === "BACKSPACE") {
      if (colRef.current === 0) return;

      newRows[curRow][colRef.current - 1] = "";
      setCurCol(colRef.current - 1);
      setRows(newRows);
      return;
    }

    if (colRef.current >= rows[curRow].length) return;

    newRows[curRow][colRef.current] = key;
    setRows(newRows);
    setCurCol(colRef.current + 1);
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join("");
    const targetWord = words[curRow].word;

    if (currentWord.length < targetWord.length) return;

    const states = currentWord.split("").map((letter, i) => {
      if (letter === targetWord[i]) return "green";
      if (targetWord.includes(letter)) return "yellow";
      return "gray";
    });

    setLetterStates((prev) => {
      const copy = [...prev];
      copy[curRow] = states;
      return copy;
    });

    // ✅ mark evaluated (for keyboard)
    setEvaluatedRows((prev) => {
      const copy = [...prev];
      copy[curRow] = true;
      return copy;
    });

    // ✅ only advance if solved
    if (currentWord === targetWord) {
      setCurRow((prev) => prev + 1);
      setCurCol(0);
    }
  };

  // 🎹 Keyboard colors (only for current row)
  const keyboardColors = React.useMemo(() => {
    const green = new Set<string>();
    const yellow = new Set<string>();
    const gray = new Set<string>();

    // Only look at the current row
    if (curRow < letterStates.length && evaluatedRows[curRow]) {
      letterStates[curRow].forEach((state, colIndex) => {
        const letter = rows[curRow]?.[colIndex];
        if (!letter) return;

        if (state === "green") {
          green.add(letter);
        } else if (state === "yellow") {
          yellow.add(letter);
        } else if (state === "gray") {
          gray.add(letter);
        }
      });
    }

    return {
      greenLetters: [...green],
      yellowLetters: [...yellow],
      grayLetters: [...gray],
    };
  }, [letterStates, rows, evaluatedRows, curRow]);

  if (!rows.length) return null;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.rowsContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.cellContainer}>
              {row.map((cell, cellIndex) => (
                <GameCell
                  key={`${rowIndex}-${cellIndex}`}
                  size={24}
                  status={letterStates[rowIndex]?.[cellIndex] ?? "empty"}
                  isActive={rowIndex === curRow && cellIndex === curCol}
                >
                  {cell}
                </GameCell>
              ))}
            </View>
          ))}
        </View>

        <CustomText>{words[curRow]?.hint}</CustomText>

        <CustomKeyboard {...keyboardColors} onKeyPressed={handleKeyPress} />
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

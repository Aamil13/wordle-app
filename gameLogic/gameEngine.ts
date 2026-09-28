import {
  CellAnimation,
  CellState,
  GameConfig,
  GameState,
  RowAnimation
} from "./gameTypes";

export const initGameState = (config: GameConfig): GameState => {
  return {
    rows: config.words.map((w) =>
      Array.from({ length: w.word.length }, () => ""),
    ),
    letterStates: config.words.map((w) =>
      Array.from({ length: w.word.length }, () => "empty"),
    ),
    evaluatedRows: config.words.map(() => false),
    curRow: 0,
    curCol: 0,
    failCount: config.maxFails,
    isWin: false,
    isLose: false,
    keyboardColors: {
      greenLetters: [],
      yellowLetters: [],
      grayLetters: [],
    },
    words: config.words,
    rowAnimation: { type: "idle", rowIndex: null },
    cellAnimation: { type: "idle", rowIndex: null },
    backspaceDanger: false,
  };
};

export const evaluateWord = (guess: string, target: string): CellState[] => {
  const result: CellState[] = Array(target.length).fill("gray");
  const targetLetters = target.split("");

  // Pass 1 → greens
  guess.split("").forEach((letter, i) => {
    if (letter === target[i]) {
      result[i] = "green";
      targetLetters[i] = "_"; // mark consumed
    }
  });

  // Pass 2 → yellows
  guess.split("").forEach((letter, i) => {
    if (result[i] === "green") return;

    const index = targetLetters.indexOf(letter);
    if (index !== -1) {
      result[i] = "yellow";
      targetLetters[index] = "_";
    }
  });

  return result;
};

export const gameReducer = (
  state: GameState,
  action: any,
  config: GameConfig,
): GameState => {
  if (state.isWin || state.isLose) return state;

  switch (action.type) {
    case "ADD_LETTER": {
      if (state.curCol >= state.rows[state.curRow].length) return state;

      const rows = state.rows.map((r) => [...r]);
      rows[state.curRow][state.curCol] = action.payload;

      const newCol = state.curCol + 1;
      const rowLength = rows[state.curRow].length;

      // 👇 If row becomes full → auto submit
      if (newCol === rowLength) {
        return gameReducer(
          {
            ...state,
            rows,
            curCol: newCol,
          },
          { type: "SUBMIT" },
          config,
        );
      }

      return {
        ...state,
        rows,
        curCol: newCol,
      };
    }

    case "BACKSPACE": {
      if (state.curCol === 0) return state;

      const rows = state.rows.map((r) => [...r]);
      rows[state.curRow][state.curCol - 1] = "";

      return {
        ...state,
        rows,
        curCol: state.curCol - 1,
      };
    }

    case "SUBMIT": {
      const guess = state.rows[state.curRow].join("");
      const target = (state.words || config.words)[state.curRow].word;

      if (guess.length < target.length) return state;

      const evaluation = evaluateWord(guess, target);

      const letterStates = [...state.letterStates];
      letterStates[state.curRow] = evaluation;

      const evaluatedRows = [...state.evaluatedRows];
      evaluatedRows[state.curRow] = true;

      const isCorrect = guess === target;

      const nextRow = isCorrect ? state.curRow + 1 : state.curRow;

      const failCount = isCorrect ? state.failCount : state.failCount - 1;

      const isWin = isCorrect && state.curRow === config.words.length - 1;

      const isLose = failCount <= 0;

      // 🎯 Animations
      let rowAnimation: RowAnimation = { type: "idle", rowIndex: null };
      let cellAnimation: CellAnimation = { type: "idle", rowIndex: null };
      let backspaceDanger: boolean = false;

      if (!isCorrect) {
        rowAnimation = { type: "shake", rowIndex: state.curRow };
        backspaceDanger = true;
        // cellAnimation = { type: "flip", rowIndex: state.curRow };
      }

      if (isCorrect) {
        cellAnimation = { type: "flip", rowIndex: state.curRow };
        cellAnimation = { type: "success", rowIndex: state.curRow };
        rowAnimation = { type: "row-enter", rowIndex: nextRow };
        backspaceDanger = false;
      }

      const baseState = {
        ...state,
        letterStates,
        evaluatedRows,
        curRow: nextRow,
        curCol: isCorrect ? 0 : state.curCol,
        failCount,
        isWin,
        isLose,
        rowAnimation,
        cellAnimation,
        backspaceDanger,
      };

      // Apply mode-specific logic after successful submission
      if (isCorrect && !isWin && !isLose) {
        const modeState = handleModeSpecificLogic(baseState, config);
        return { ...baseState, ...modeState };
      }

      return baseState;
    }

    case "CLEAR_ANIMATION":
      return {
        ...state,
        rowAnimation: { type: "idle", rowIndex: null },
        cellAnimation: { type: "idle", rowIndex: null },
      };

    default:
      return state;
  }
};

export const computeKeyboardColorsForRow = (
  rowIndex: number,
  rows: string[][],
  letterStates: CellState[][],
  evaluatedRows: boolean[],
) => {
  const green = new Set<string>();
  const yellow = new Set<string>();
  const gray = new Set<string>();

  if (!evaluatedRows[rowIndex]) {
    return {
      greenLetters: [],
      yellowLetters: [],
      grayLetters: [],
    };
  }

  letterStates[rowIndex].forEach((state, colIndex) => {
    const letter = rows[rowIndex][colIndex];
    if (!letter) return;

    if (state === "green") green.add(letter);
    if (state === "yellow") yellow.add(letter);
    if (state === "gray") gray.add(letter);
  });

  return {
    greenLetters: [...green],
    yellowLetters: [...yellow],
    grayLetters: [...gray],
  };
};

// Mode-specific handlers
type ModeHandler = (
  state: GameState,
  config: GameConfig,
) => Partial<GameState>;

const infiniteModeHandler: ModeHandler = (state, config) => {
  // Count completed rows
  const completedRowsCount = state.evaluatedRows.filter((r) => r).length;

  // If 2 or more rows are completed and user still has fails left, rotate
  if (completedRowsCount >= 2 && state.failCount > 0) {
    const currentRows = state.rows;
    const currentLetterStates = state.letterStates;
    const currentEvaluatedRows = state.evaluatedRows;
    const currentWords = state.words;

    // Remove first 2 completed rows
    const remainingRows = currentRows.slice(2);
    const remainingLetterStates = currentLetterStates.slice(2);
    const remainingEvaluatedRows = currentEvaluatedRows.slice(2);
    const remainingWords = currentWords.slice(2);

    // Get the last row (which is now the first in remaining array)
    const lastRow = remainingRows[remainingRows.length - 1];
    const lastLetterState = remainingLetterStates[remainingLetterStates.length - 1];
    const lastEvaluatedRow = remainingEvaluatedRows[remainingEvaluatedRows.length - 1];
    const lastWord = remainingWords[remainingWords.length - 1];

    // Get 2 new random words for the new rows
    const { getRandomWords, incrementWordShownCount } = require("../localDb/pushToSqlLite");
    const newWords = getRandomWords(2);

    // Increment noOfTimesShown for the newly fetched words
    newWords.forEach((word: any) => {
      if (word._id) {
        incrementWordShownCount(word._id);
      }
    });

    // Create 2 new rows with empty cells based on actual word lengths
    const newRow1 = Array.from({ length: newWords[0].word.length }, () => "");
    const newRow2 = Array.from({ length: newWords[1].word.length }, () => "");
    const newLetterState1: CellState[] = Array.from({ length: newWords[0].word.length }, () => "empty");
    const newLetterState2: CellState[] = Array.from({ length: newWords[1].word.length }, () => "empty");

    // Make the last row first, then add 2 new rows below it
    const newRows = [lastRow, ...remainingRows.slice(0, -1), newRow1, newRow2];
    const newLetterStates = [
      lastLetterState,
      ...remainingLetterStates.slice(0, -1),
      newLetterState1,
      newLetterState2,
    ];
    const newEvaluatedRows = [
      lastEvaluatedRow,
      ...remainingEvaluatedRows.slice(0, -1),
      false,
      false,
    ];
    const newWordsArray = [lastWord, ...remainingWords.slice(0, -1), ...newWords];

    return {
      rows: newRows,
      letterStates: newLetterStates,
      evaluatedRows: newEvaluatedRows,
      words: newWordsArray,
      curRow: 0, // Reset to first row
      curCol: 0,
    };
  }

  return {};
};

const classicModeHandler: ModeHandler = (state, config) => {
  // Classic mode doesn't modify rows
  return {};
};

// Mode handler registry
const modeHandlers: Record<string, ModeHandler> = {
  infinite: infiniteModeHandler,
  classic: classicModeHandler,
};

export const handleModeSpecificLogic = (
  state: GameState,
  config: GameConfig,
): Partial<GameState> => {
  const handler = modeHandlers[config.mode] || classicModeHandler;
  return handler(state, config);
};

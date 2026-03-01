import { CellState, GameConfig, GameState } from "./gameTypes";

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
    rowAnimation: { type: "idle", rowIndex: null },
    cellAnimation: { type: "idle", rowIndex: null },
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
      const target = config.words[state.curRow].word;

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
      let rowAnimation = { type: "idle", rowIndex: null };
      let cellAnimation = { type: "idle", rowIndex: null };

      if (!isCorrect) {
        rowAnimation = { type: "shake", rowIndex: state.curRow };
        cellAnimation = { type: "flip", rowIndex: state.curRow };
      }

      if (isCorrect) {
        cellAnimation = { type: "success", rowIndex: state.curRow };
        rowAnimation = { type: "row-enter", rowIndex: nextRow };
      }

      return {
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
      };
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

import {
  CellAnimation,
  CellState,
  GameConfig,
  GameState,
  RowAnimation
} from "./gameTypes";

// ==================== GAME STATE INITIALIZATION ====================

/**
 * Creates an initial game state based on the provided configuration.
 * Initializes empty rows, letter states, and sets up the game board.
 */
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
    correctGuesses: 0,
    rowAnimation: { type: "idle", rowIndex: null },
    cellAnimation: { type: "idle", rowIndex: null },
    backspaceDanger: false,
  };
};

// ==================== WORD EVALUATION ====================

/**
 * Evaluates a guess against a target word and returns the color state for each letter.
 * Uses a two-pass algorithm:
 * - Pass 1: Mark correct letters in the correct position as green
 * - Pass 2: Mark correct letters in wrong positions as yellow
 */
export const evaluateWord = (guess: string, target: string): CellState[] => {
  const result: CellState[] = Array(target.length).fill("gray");
  const targetLetters = target.split("");

  // Pass 1: Mark letters in the correct position as green
  guess.split("").forEach((letter, i) => {
    if (letter === target[i]) {
      result[i] = "green";
      targetLetters[i] = "_"; // Mark as consumed
    }
  });

  // Pass 2: Mark letters in wrong positions as yellow
  guess.split("").forEach((letter, i) => {
    if (result[i] === "green") return; // Skip already marked letters

    const index = targetLetters.indexOf(letter);
    if (index !== -1) {
      result[i] = "yellow";
      targetLetters[index] = "_"; // Mark as consumed
    }
  });

  return result;
};

// ==================== GAME REDUCER ====================

/**
 * Main game state reducer that handles all game actions.
 * Returns unchanged state if game is already won or lost.
 */
export const gameReducer = (
  state: GameState,
  action: any,
  config: GameConfig,
): GameState => {
  if (state.isWin || state.isLose) return state;

  switch (action.type) {
    case "ADD_LETTER":
      return handleAddLetter(state, action.payload, config);

    case "BACKSPACE":
      return handleBackspace(state);

    case "SUBMIT":
      return handleSubmit(state, config);

    case "CLEAR_ANIMATION":
      return handleClearAnimation(state);

    case "RESET":
      return initGameState(config);

    default:
      return state;
  }
};

/**
 * Handles adding a letter to the current cell.
 * Auto-submits when the row becomes full.
 */
const handleAddLetter = (
  state: GameState,
  letter: string,
  config: GameConfig,
): GameState => {
  if (state.curCol >= state.rows[state.curRow].length) return state;

  const rows = state.rows.map((r) => [...r]);
  rows[state.curRow][state.curCol] = letter;

  const newCol = state.curCol + 1;
  const rowLength = rows[state.curRow].length;

  // Auto-submit when row becomes full
  if (newCol === rowLength) {
    return gameReducer(
      { ...state, rows, curCol: newCol },
      { type: "SUBMIT" },
      config,
    );
  }

  return { ...state, rows, curCol: newCol };
};

/**
 * Handles backspace by removing the last letter in the current row.
 */
const handleBackspace = (state: GameState): GameState => {
  if (state.curCol === 0) return state;

  const rows = state.rows.map((r) => [...r]);
  rows[state.curRow][state.curCol - 1] = "";

  return {
    ...state,
    rows,
    curCol: state.curCol - 1,
  };
};

/**
 * Handles word submission, evaluation, and game state updates.
 */
const handleSubmit = (state: GameState, config: GameConfig): GameState => {
  const guess = state.rows[state.curRow].join("");
  const target = (state.words || config.words)[state.curRow].word;

  if (guess.length < target.length) return state;

  const evaluation = evaluateWord(guess, target);
  const isCorrect = guess === target;

  const updatedState = updateStateAfterSubmission(
    state,
    evaluation,
    isCorrect,
    config,
  );

  // Apply mode-specific logic after successful submission
  if (isCorrect && !updatedState.isWin && !updatedState.isLose) {
    const modeState = handleModeSpecificLogic(updatedState, config);
    return { ...updatedState, ...modeState };
  }

  return updatedState;
};

/**
 * Updates the game state after a word submission.
 * Handles letter states, animations, win/lose conditions.
 */
const updateStateAfterSubmission = (
  state: GameState,
  evaluation: CellState[],
  isCorrect: boolean,
  config: GameConfig,
): GameState => {
  const letterStates = [...state.letterStates];
  letterStates[state.curRow] = evaluation;

  const evaluatedRows = [...state.evaluatedRows];
  evaluatedRows[state.curRow] = true;

  const nextRow = isCorrect ? state.curRow + 1 : state.curRow;
  const failCount = isCorrect ? state.failCount : state.failCount - 1;
  const correctGuesses = isCorrect ? state.correctGuesses + 1 : state.correctGuesses;
  const isWin = isCorrect && state.curRow === config.words.length - 1;
  const isLose = failCount <= 0;

  const animations = determineAnimations(isCorrect, state.curRow, nextRow);

  return {
    ...state,
    letterStates,
    evaluatedRows,
    curRow: nextRow,
    curCol: isCorrect ? 0 : state.curCol,
    failCount,
    correctGuesses,
    isWin,
    isLose,
    ...animations,
  };
};

/**
 * Determines the appropriate animations based on submission result.
 */
const determineAnimations = (
  isCorrect: boolean,
  currentRow: number,
  nextRow: number,
): { rowAnimation: RowAnimation; cellAnimation: CellAnimation; backspaceDanger: boolean } => {
  if (isCorrect) {
    return {
      rowAnimation: { type: "row-enter", rowIndex: nextRow },
      cellAnimation: { type: "success", rowIndex: currentRow },
      backspaceDanger: false,
    };
  }

  return {
    rowAnimation: { type: "shake", rowIndex: currentRow },
    cellAnimation: { type: "idle", rowIndex: null },
    backspaceDanger: true,
  };
};

/**
 * Clears all active animations.
 */
const handleClearAnimation = (state: GameState): GameState => {
  return {
    ...state,
    rowAnimation: { type: "idle", rowIndex: null },
    cellAnimation: { type: "idle", rowIndex: null },
  };
};

// ==================== KEYBOARD COLOR COMPUTATION ====================

/**
 * Computes keyboard color updates for a specific row.
 * Returns empty arrays if the row hasn't been evaluated yet.
 */
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

// ==================== MODE-SPECIFIC LOGIC ====================

/**
 * Type definition for mode handler functions.
 * Each mode handler returns partial state updates.
 */
type ModeHandler = (
  state: GameState,
  config: GameConfig,
) => Partial<GameState>;

/**
 * Handles infinite mode logic: rotates rows when 2+ are completed.
 * Removes the first 2 completed rows, keeps the last row, and adds 2 new words.
 */
const infiniteModeHandler: ModeHandler = (state, config) => {
  const completedRowsCount = state.evaluatedRows.filter((r) => r).length;

  // Only rotate if 2+ rows are completed and player still has fails left
  if (completedRowsCount >= 2 && state.failCount > 0) {
    return rotateRowsForInfiniteMode(state);
  }

  return {};
};

/**
 * Performs the actual row rotation for infinite mode.
 * - Removes first 2 completed rows
 * - Moves the last row to the top
 * - Adds 2 new random words at the bottom
 */
const rotateRowsForInfiniteMode = (state: GameState): Partial<GameState> => {
  // Remove first 2 completed rows
  const remainingRows = state.rows.slice(2);
  const remainingLetterStates = state.letterStates.slice(2);
  const remainingEvaluatedRows = state.evaluatedRows.slice(2);
  const remainingWords = state.words.slice(2);

  // Get the last row (which becomes the first row after rotation)
  const lastRow = remainingRows[remainingRows.length - 1];
  const lastLetterState = remainingLetterStates[remainingLetterStates.length - 1];
  const lastEvaluatedRow = remainingEvaluatedRows[remainingEvaluatedRows.length - 1];
  const lastWord = remainingWords[remainingWords.length - 1];

  // Fetch 2 new random words
  const { getRandomWords, incrementWordShownCount } = require("../localDb/pushToSqlLite");
  const newWords = getRandomWords(2);

  // Track word usage for analytics
  newWords.forEach((word: any) => {
    if (word._id) {
      incrementWordShownCount(word._id);
    }
  });

  // Create empty rows for the new words
  const newRows = createEmptyRowsForWords(newWords);
  const newLetterStates = createEmptyLetterStatesForWords(newWords);

  // Reconstruct arrays: last row + remaining middle rows + 2 new rows
  const rotatedRows = [
    lastRow,
    ...remainingRows.slice(0, -1),
    ...newRows,
  ];
  const rotatedLetterStates = [
    lastLetterState,
    ...remainingLetterStates.slice(0, -1),
    ...newLetterStates,
  ];
  const rotatedEvaluatedRows = [
    lastEvaluatedRow,
    ...remainingEvaluatedRows.slice(0, -1),
    false, // New rows are not evaluated
    false,
  ];
  const rotatedWords = [lastWord, ...remainingWords.slice(0, -1), ...newWords];

  return {
    rows: rotatedRows,
    letterStates: rotatedLetterStates,
    evaluatedRows: rotatedEvaluatedRows,
    words: rotatedWords,
    correctGuesses: state.correctGuesses, // Preserve correct guesses count during rotation
    curRow: 0, // Reset to first row
    curCol: 0,
  };
};

/**
 * Creates empty row arrays for the given words.
 */
const createEmptyRowsForWords = (words: any[]): string[][] => {
  return words.map((word) =>
    Array.from({ length: word.word.length }, () => ""),
  );
};

/**
 * Creates empty letter state arrays for the given words.
 */
const createEmptyLetterStatesForWords = (words: any[]): CellState[][] => {
  return words.map((word) =>
    Array.from({ length: word.word.length }, () => "empty"),
  );
};

/**
 * Classic mode handler - no special logic needed.
 */
const classicModeHandler: ModeHandler = (state, config) => {
  return {};
};

/**
 * Registry of mode-specific handlers.
 */
const modeHandlers: Record<string, ModeHandler> = {
  infinite: infiniteModeHandler,
  classic: classicModeHandler,
};

/**
 * Dispatches to the appropriate mode handler based on the game configuration.
 */
export const handleModeSpecificLogic = (
  state: GameState,
  config: GameConfig,
): Partial<GameState> => {
  const handler = modeHandlers[config.mode] || classicModeHandler;
  return handler(state, config);
};

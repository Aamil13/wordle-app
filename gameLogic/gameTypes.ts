export type CellState = "green" | "yellow" | "gray" | "empty";

export type WordItem = {
  word: string;
  hint: string;
};

export type GameConfig = {
  words: WordItem[];
  maxFails: number;
};

export type KeyboardColors = {
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export type RowAnimation = {
  type: "idle" | "shake" | "row-enter";
  rowIndex: number | null;
};

export type CellAnimation = {
  type: "idle" | "flip" | "success";
  rowIndex: number | null;
};

export type GameState = {
  rows: string[][];
  letterStates: CellState[][];
  evaluatedRows: boolean[];
  curRow: number;
  curCol: number;
  failCount: number;
  isWin: boolean;
  isLose: boolean;
  keyboardColors: KeyboardColors;

  // 👇 ADD THESE
  rowAnimation: RowAnimation;
  cellAnimation: CellAnimation;
};

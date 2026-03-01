import { useReducer } from "react";
import { gameReducer, initGameState } from "./gameEngine";
import { GameConfig } from "./gameTypes";

export const useGame = (config: GameConfig) => {
  const [state, dispatchBase] = useReducer(
    (s: any, a: any) => gameReducer(s, a, config),
    initGameState(config),
  );

  const dispatch = (action: any) => dispatchBase(action);

  return {
    state,
    addLetter: (l: string) => dispatch({ type: "ADD_LETTER", payload: l }),
    backspace: () => dispatch({ type: "BACKSPACE" }),
    submit: () => dispatch({ type: "SUBMIT" }),
  };
};

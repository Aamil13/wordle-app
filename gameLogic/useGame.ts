import { useEffect, useReducer } from "react";
import { gameReducer, initGameState } from "./gameEngine";
import { GameConfig } from "./gameTypes";

export const useGame = (config: GameConfig) => {
  const [state, dispatchBase] = useReducer(
    (s: any, a: any) => gameReducer(s, a, config),
    initGameState(config),
  );

  const dispatch = (action: any) => dispatchBase(action);

  // Reset game state when words change from empty to having data
  useEffect(() => {
    if (config.words.length > 0 && state.words.length === 0) {
      dispatch({ type: "RESET" });
    }
  }, [config.words.length, state.words.length]);

  return {
    state,
    addLetter: (l: string) => dispatch({ type: "ADD_LETTER", payload: l }),
    backspace: () => dispatch({ type: "BACKSPACE" }),
    submit: () => dispatch({ type: "SUBMIT" }),
  };
};

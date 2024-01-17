import { useDispatch, useSelector } from "react-redux";
import "./TTTMode.css";
import { playActions } from "../Store/play-slice";
import { gridActions } from "../Store/grid-slice";
import { useEffect } from "react";

export default function TTTMode() {
  const mode = useSelector((state) => state.play.mode);
  const dispatch = useDispatch();
  //   console.log(mode);

  // TODO make player selction random as well

  useEffect(() => {
    if (mode === "regular")
      dispatch(playActions.setSelected({ currentPlayer: "Red", lvl: "md" }));
  }, [mode, dispatch]);

  function modeClickHandler(inputMode) {
    dispatch(playActions.resetHands());
    console.log("TTTMode clickhandeler inputMode:" + inputMode);
    if (inputMode === "regular") {
      // TODO: current player is chosen random
      dispatch(playActions.setSelected({ currentPlayer: "Red", lvl: "md" }));
    } else {
      dispatch(playActions.setSelected(null));
    }
    dispatch(playActions.resetWinner());
    dispatch(gridActions.resetGrid());
    dispatch(playActions.setMode(inputMode));
  }
  return (
    <div className="ttt-mode">
      <p className="inline">Mode:</p>
      <button
        onClick={() => modeClickHandler("regular")}
        className={mode === "regular" ? "ttt-selected" : ""}
      >
        Regular
      </button>
      <button
        onClick={() => modeClickHandler("russian")}
        className={mode === "russian" ? "ttt-selected" : ""}
      >
        Russian Doll
      </button>
    </div>
  );
}

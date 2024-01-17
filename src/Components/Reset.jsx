import { useDispatch, useSelector } from "react-redux";
import "./Reset.css";
import { playActions } from "../Store/play-slice";
import { gridActions } from "../Store/grid-slice";

export default function Reset() {
  const winner = useSelector((state) => state.play.winner);
  const mode = useSelector((state) => state.play.mode);
  const dispatch = useDispatch();

  function resetHandler() {
    dispatch(playActions.resetWinner());
    dispatch(gridActions.resetGrid());
    dispatch(playActions.resetHands());

    if (mode === "regular") {
      dispatch(playActions.setSelected({ currentPlayer: "Red", lvl: "md" }));
    }

    console.log("Reset");
  }

  return (
    <>
      {winner && (
        <button className="btn" onClick={resetHandler}>
          Reset Game
        </button>
      )}
    </>
  );
}

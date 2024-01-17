import { useDispatch, useSelector } from "react-redux";
import "./LevelChooser.css";
import { playActions } from "../Store/play-slice";

export default function LevelChooser() {
  const handRed = useSelector((state) => state.play.handRed);
  const handBlue = useSelector((state) => state.play.handBlue);
  const selected = useSelector((state) => state.play.selected);
  const currentPlayer = useSelector((state) => state.play.currentPlayer);
  const localPlayer = useSelector((state) => state.play.localPlayer);

  const hand = currentPlayer === "Red" ? handRed : handBlue;
  const dispatch = useDispatch();

  const lvlOne = hand["sm"];
  const lvlTwo = hand["md"];
  const lvlThree = hand["lg"];

  function btnStyles(lvl) {
    //console.log("Lvl chooser btnstyle: " + hand[lvl]);
    if (localPlayer && localPlayer !== currentPlayer) return "lvl-unselectable";
    if (hand[lvl] > 0 && selected && selected.lvl === lvl)
      return "lvl-selected";
    if (hand[lvl] > 0) return "lvl-selectable";
    else return "lvl-unselectable";
  }

  function selectionHandler(lvl) {
    if (localPlayer && localPlayer !== currentPlayer) return;
    if (hand[lvl] < 1) return;
    console.log("Selected:" + lvl);
    // if (selected && selected.lvl === lvl)

    // If user try to select while moveSelect, then reset moveSelect
    dispatch(playActions.setMoveSelected(null));
    if (selected) {
      dispatch(playActions.setSelected(null));
    } else {
      dispatch(playActions.setSelected({ currentPlayer, lvl }));
    }
  }

  console.log(currentPlayer, hand);
  return (
    <>
      <div className="lvl-chooser">
        <p className="inline">Level: </p>
        <button
          onClick={() => selectionHandler("sm")}
          className={btnStyles("sm")}
        >
          Small: {lvlOne}
        </button>
        <button
          onClick={() => selectionHandler("md")}
          className={btnStyles("md")}
        >
          Medium: {lvlTwo}
        </button>
        <button
          onClick={() => selectionHandler("lg")}
          className={btnStyles("lg")}
        >
          Large {lvlThree}
        </button>
      </div>
    </>
  );
}

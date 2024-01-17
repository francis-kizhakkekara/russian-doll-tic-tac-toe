import { gridActions } from "../Store/grid-slice";
import { playActions } from "../Store/play-slice";

// Reset all and set multiplayerMode to local and mode to regular
export function resetAll(dispatch) {
  dispatch(playActions.resetWinner());
  dispatch(gridActions.resetGrid());
  dispatch(playActions.resetHands());
  dispatch(playActions.setMode("regular"));
  dispatch(playActions.setSelected({ currentPlayer: "Red", lvl: "md" }));
  dispatch(playActions.setMultiplayerMode("local"));
  dispatch(playActions.setRoomNo(null));
}

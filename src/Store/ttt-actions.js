import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { gridActions } from "./grid-slice";
import { playActions } from "./play-slice";
import { db } from "../Firestore-config";
import { resetAll } from "../Functions/play-functions";

export const getStateFromFB = () => {
  return async (dispatch) => {
    console.log("ttt-actions getStateFromFB");
    const docRef = doc(db, "TTT", "default");
    const docSnap = await getDoc(docRef);
    const fbData = docSnap.data();
    console.log(fbData);
    // Set Grid
    dispatch(gridActions.setGrid(fbData.lvlGrid));
    // Set currentPlayer
    dispatch(playActions.setCurrentPlayer(fbData.currentPlayer));
    // Set Mode
    dispatch(playActions.setMode(fbData.mode));
    // Set hand Red and blue
    dispatch(
      playActions.setHands({
        handRed: fbData.handRed,
        handBlue: fbData.handBlue,
      })
    );

    dispatch(playActions.setTimestamp(fbData.timestamps));
    dispatch(playActions.setSelected(null));
  };
};

export const sendStateToFB = (appState, roomNo) => {
  return async () => {
    console.log("ttt-actions sendStateToFB");
    const tttRef =
      roomNo === "def"
        ? doc(db, "TTT", `default`)
        : doc(db, "TTT", `room${roomNo}`);
    // const tttRef = doc(db, "TTT", `room4242`);

    // Sending state to Firestore
    await setDoc(tttRef, appState);
    console.log("Setting Firebase");
  };
};

let setInitialTimestamp = true;

export const connectToRoom = (roomNo, playerTimestamp) => {
  return (dispatch) => {
    console.log("ttt-actions connectToRoom");
    // console.log(getState().play);
    const tttUpdateRef =
      roomNo === "def"
        ? doc(db, "TTT", `default`)
        : doc(db, "TTT", `room${roomNo}`);
    const tttRef =
      roomNo === "def"
        ? doc(db, "TTT", `default`)
        : doc(db, "TTT", `room${roomNo}`);
    console.log(tttRef);
    // const tttRef = doc(db, "TTT", `default`);
    const unsub = onSnapshot(
      tttRef,
      async (docRef) => {
        const fbData = docRef.data();
        console.log("Current data: ", docRef.data());

        // Set Grid
        if (fbData && fbData["lvlGrid"]) {
          dispatch(gridActions.setGrid(fbData.lvlGrid));
          // Set currentPlayer
          dispatch(playActions.setCurrentPlayer(fbData.currentPlayer));
          // Set Mode
          dispatch(playActions.setMode(fbData.mode));
          // Set hand Red and blue
          dispatch(
            playActions.setHands({
              handRed: fbData.handRed,
              handBlue: fbData.handBlue,
            })
          );
          // If mode = 'regular' then setSelected to
          if (fbData.mode === "regular") {
            dispatch(
              playActions.setSelected({ currentPlayer: "Red", lvl: "md" })
            );
          } else {
            dispatch(playActions.setSelected(null));
          }
          dispatch(playActions.setRoomNo(roomNo));
          // Check both the values in the array
          console.log("Player timestamp", playerTimestamp);
          console.log("Old timestamps", fbData.timestamps);
          const newTimeStamp = fbData.timestamps;

          if (setInitialTimestamp) {
            if (newTimeStamp.player1 === playerTimestamp) {
              dispatch(playActions.setLocalPlayer("Red"));
            } else if (newTimeStamp.player2 === playerTimestamp) {
              dispatch(playActions.setLocalPlayer("Blue"));
            } else {
              if (newTimeStamp.player1 < newTimeStamp.player2) {
                newTimeStamp.player1 = playerTimestamp;
                dispatch(playActions.setLocalPlayer("Red"));
              } else {
                newTimeStamp.player2 = playerTimestamp;
                dispatch(playActions.setLocalPlayer("Blue"));
              }

              await updateDoc(tttUpdateRef, { timestamps: newTimeStamp });
              dispatch(playActions.setTimestamp(newTimeStamp));
              console.log("New Timestamps: ", newTimeStamp);
            }

            setInitialTimestamp = false;
          }
        } else {
          console.log("No grid data in FB");
          resetAll(dispatch);
        }
      },
      (error) => {
        console.log("FB error:", error);
        resetAll(dispatch);
      }
    );

    // console.log("Unsub", unsub);
    return unsub;
  };
};

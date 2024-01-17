import { createSlice } from "@reduxjs/toolkit";

const handRedInitial = { sm: 2, md: 2, lg: 2 };
const handBlueInitial = { sm: 2, md: 2, lg: 2 };

const playInit = {
  multiplayerMode: "local",
  roomNo: null,
  localPlayer: null,
  timestamps: { player1: 0, player2: 0 },
  currentPlayer: "Red",
  winner: null,
  mode: "regular",
  handRed: handRedInitial,
  handBlue: handBlueInitial,
  selected: null,
  movingSelected: null,
};

const playSlice = createSlice({
  name: "play",
  initialState: playInit,
  reducers: {
    togglePlayer(state) {
      if (state.currentPlayer === "Red") {
        state.currentPlayer = "Blue";
      } else {
        state.currentPlayer = "Red";
      }
    },
    setWinner(state, action) {
      state.winner = action.payload;
    },
    resetWinner(state) {
      state.winner = null;
    },
    setMode(state, action) {
      if (action.payload === "russian") state.mode = action.payload;
      else state.mode = "regular";
    },
    takePieceFromHand(state, action) {
      const pieceToPlace = action.payload;

      if (state.selected["currentPlayer"] === "Red") {
        if (state.handRed[pieceToPlace] < 1) return;
        state.handRed[pieceToPlace]--;
      } else {
        if (state.handBlue[pieceToPlace] < 1) return;
        state.handBlue[pieceToPlace]--;
      }

      state.selected = null;
    },

    resetHands(state) {
      state.handBlue = { sm: 2, md: 2, lg: 2 };
      state.handRed = { sm: 2, md: 2, lg: 2 };
      state.selected = null;
    },
    setSelected(state, action) {
      if (action.payload) {
        const { currentPlayer, lvl } = action.payload;
        state.selected = { currentPlayer, lvl };
        // console.log("Play slice setSelected: ", { currentPlayer, lvl });
      } else {
        state.selected = null;
      }
    },
    setMoveSelected(state, action) {
      // Need index and currentPlayer

      state.movingSelected = action.payload;
    },
    setCurrentPlayer(state, action) {
      state.currentPlayer = action.payload;
    },
    setHands(state, action) {
      state.handRed = action.payload.handRed;
      state.handBlue = action.payload.handBlue;
    },
    setMultiplayerMode(state, action) {
      state.multiplayerMode = action.payload;
      if (action.payload === "local") {
        state.roomNo = null;
        state.localPlayer = null;
      }
    },
    setTimestamp(state, action) {
      state.timestamps = action.payload;
    },
    setLocalPlayer(state, action) {
      state.localPlayer = action.payload;
    },
    setRoomNo(state, action) {
      state.roomNo = action.payload;
    },
  },
});

export const playActions = playSlice.actions;

export default playSlice;

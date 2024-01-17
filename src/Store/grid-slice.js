import { createSlice } from "@reduxjs/toolkit";

const levelGrid = new Array(9).fill({ cell: [] });

const gridSlice = createSlice({
  name: "grid",
  initialState: { levelGrid, changesToUpload: false },
  reducers: {
    resetGrid(state) {
      state.levelGrid = new Array(9).fill({ cell: [] });
      state.changesToUpload = !state.changesToUpload;
    },
    addToLvlGrid(state, action) {
      //TODO check if it can be added
      const { currentPlayer, lvl, index } = action.payload;
      state.levelGrid[index]["cell"].push({ currentPlayer, lvl });
      state.changesToUpload = !state.changesToUpload;
    },
    movePiece(state, action) {
      const { moveFrom, moveTo } = action.payload;
      const thePiece = state.levelGrid[moveFrom]["cell"].pop();
      state.levelGrid[moveTo]["cell"].push(thePiece);
      state.changesToUpload = !state.changesToUpload;
    },

    setGrid(state, action) {
      state.levelGrid = action.payload;
    },
  },
});

export const gridActions = gridSlice.actions;

export default gridSlice;

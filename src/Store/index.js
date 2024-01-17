import { configureStore } from "@reduxjs/toolkit";
import gridSlice from "./grid-slice";
import playSlice from "./play-slice";

const store = configureStore({
  reducer: {
    grid: gridSlice.reducer,
    play: playSlice.reducer,
  },
});

export default store;

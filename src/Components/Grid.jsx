import "./Grid.css";

import { gridActions } from "../Store/grid-slice";
import { playActions } from "../Store/play-slice";
import { useDispatch, useSelector } from "react-redux";

import Cell from "./Cell";
import { useEffect } from "react";

import { sendStateToFB } from "../Store/ttt-actions";

export default function Grid() {
  const dispatch = useDispatch();
  const lvlGrid = useSelector((state) => state.grid.levelGrid);
  const changesToUpload = useSelector((state) => state.grid.changesToUpload);

  const currentPlayer = useSelector((state) => state.play.currentPlayer);
  const localPlayer = useSelector((state) => state.play.localPlayer);

  // console.log("Grid currentPlayer: " + currentPlayer);
  const lvlSelected = useSelector((state) => state.play.selected);
  const winner = useSelector((state) => state.play.winner);
  const moveSelect = useSelector((state) => state.play.movingSelected);
  const handRed = useSelector((state) => state.play.handRed);
  const handBlue = useSelector((state) => state.play.handBlue);
  const timestamps = useSelector((state) => state.play.timestamps);
  const roomNo = useSelector((state) => state.play.roomNo);

  console.log(
    "Grid lvlSelected, moveSelect:",
    JSON.stringify(lvlSelected),
    moveSelect
  );

  console.log(lvlGrid);

  const mode = useSelector((state) => state.play.mode);
  // console.log("Mode:" + mode);

  function piecePlaceable(destination, source = null) {
    let result = false;
    const lvlMap = { sm: 1, md: 2, lg: 3 };

    const destPiece = lvlGrid[destination]["cell"]
      ? lvlGrid[destination]["cell"][lvlGrid[destination]["cell"].length - 1]
      : null;

    // lvlSelected
    if (source === null) {
      // if destination is empty then true
      if (!destPiece) result = true;
      console.log("Grid PiecePlaceable lvlSelect ", destPiece);
      if (destPiece && lvlMap[lvlSelected.lvl] > lvlMap[destPiece.lvl]) {
        result = true;
      }
    }

    // moveSelected
    else {
      const sourcePiece =
        lvlGrid[source]["cell"][lvlGrid[source]["cell"].length - 1];
      console.log("Grid PiecePlaceable moveSelect ", sourcePiece, destPiece);
      console.log(
        "Grid piecePlaceable moveSelect lvlComparison:",
        lvlMap[sourcePiece.lvl],
        lvlMap[destPiece.lvl]
      );
      if (destPiece && lvlMap[sourcePiece.lvl] > lvlMap[destPiece.lvl]) {
        result = true;
      }
    }
    return result;
  }

  function placeDollHandler(info) {
    console.log("Placedoll");
    // If theres a winner then do nothing
    if (winner) return;

    // If there is a localPlayer if it does not match current player, return
    if (localPlayer && localPlayer !== currentPlayer) return;

    // regular
    if (mode === "regular") {
      console.log("Placedoll regular lvlSelected", lvlSelected);

      // If not lvlSelected or there is already an item,
      if (!lvlSelected || lvlGrid[info.index]["cell"].length > 0) return;

      dispatch(gridActions.addToLvlGrid({ ...info, lvl: lvlSelected.lvl }));
      dispatch(playActions.takePieceFromHand(lvlSelected.lvl));

      const nextPlayer = currentPlayer === "Red" ? "Blue" : "Red";
      dispatch(
        playActions.setSelected({ currentPlayer: nextPlayer, lvl: "md" })
      );
      dispatch(playActions.togglePlayer());
    }

    // russian
    else if (mode === "russian") {
      // If no lvlSelected and no moveSelected, do nothing when clicking on empty sport
      if (!lvlSelected && !moveSelect && lvlGrid[info.index]["cell"].length < 1)
        return;

      const clickedCell = lvlGrid[info.index]["cell"];
      const cellSize = lvlGrid[info.index]["cell"].length;
      // lvlSelected
      if (lvlSelected) {
        // place on placeable places only
        if (piecePlaceable(info.index)) {
          dispatch(gridActions.addToLvlGrid({ ...info, lvl: lvlSelected.lvl }));
          dispatch(playActions.takePieceFromHand(lvlSelected.lvl));
          dispatch(playActions.setSelected(null));
          dispatch(playActions.togglePlayer());
        }
      }

      // MoveSelect
      else if (moveSelect) {
        //Click again on the same spot to unselect
        if (moveSelect.index === info.index) {
          dispatch(playActions.setMoveSelected(null));
        }

        // Move to spot if empty
        if (!cellSize) {
          dispatch(
            gridActions.movePiece({
              moveFrom: moveSelect.index,
              moveTo: info.index,
            })
          );
          dispatch(playActions.setMoveSelected(null));
          dispatch(playActions.togglePlayer());
        }

        // Move to spot if placeable
        else {
          // Check placeable
          if (piecePlaceable(info.index, moveSelect.index)) {
            dispatch(
              gridActions.movePiece({
                moveFrom: moveSelect.index,
                moveTo: info.index,
              })
            );
            dispatch(playActions.setMoveSelected(null));
            dispatch(playActions.togglePlayer());
          }
        }
      } else {
        if (
          clickedCell &&
          cellSize &&
          lvlGrid[info.index]["cell"][cellSize - 1]["currentPlayer"] ===
            currentPlayer
        ) {
          dispatch(playActions.setMoveSelected({ index: info.index }));
        }
      }
    }

    // else return
    else return;
  }

  useEffect(() => {
    // console.log("Grid useEffect:" + calcWinner(lvlGrid));

    dispatch(playActions.setWinner(calcWinner(lvlGrid, mode)));
  }, [lvlGrid, mode, dispatch]);

  useEffect(() => {
    // const getData = async () => {
    //   dispatch(getStateFromFB());
    // };
    const setData = async () => {
      console.log("Grid UseEffect Set FB Data");
      const dataToSend = {
        lvlGrid,
        currentPlayer,
        mode,
        handRed,
        handBlue,
        timestamps,
      };
      dispatch(sendStateToFB(dataToSend, roomNo));
    };
    // getData();

    if (roomNo && (timestamps.player1 || timestamps.player2)) {
      setData();
    }
  }, [changesToUpload, roomNo]);

  return (
    <div className="my-grid">
      {lvlGrid.map((cell, index) => {
        const cellPlayer = cell["cell"].length
          ? cell["cell"][cell["cell"].length - 1]["currentPlayer"]
          : -1;
        const cellLvl = cell["cell"].length
          ? cell["cell"][cell["cell"].length - 1]["lvl"]
          : -1;
        const highlight = moveSelect?.index === index ? true : false;
        return (
          <Cell
            key={index}
            cellPlayer={cellPlayer}
            moveSelectHighlight={highlight}
            level={cellLvl}
            onClickHandler={() => placeDollHandler({ currentPlayer, index })}
          />
        );
      })}
    </div>
  );
}

// 0 is red, X is blue
function calcWinner(gridInput, mode) {
  const grid = gridInput.map((cellObj) => cellObj["cell"]);
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // Check if none of the lines has an empty array
    if (grid[a].length > 0 && grid[b].length > 0 && grid[c].length > 0) {
      // Look at the top of the stack for all the elements
      const aUser = grid[a][grid[a].length - 1]["currentPlayer"];
      const bUser = grid[b][grid[b].length - 1]["currentPlayer"];
      const cUser = grid[c][grid[c].length - 1]["currentPlayer"];

      if (aUser === bUser && aUser === cUser) {
        return aUser;
      }
    }
  }

  // If mode is regular and table is full, then it is a draw

  if (mode === "regular") {
    let cellTotal = 0;
    grid.forEach((element) => {
      if (element.length > 0) cellTotal++;
    });

    if (cellTotal >= 9) {
      return "it is a draw";
    }
  }

  return null;
}

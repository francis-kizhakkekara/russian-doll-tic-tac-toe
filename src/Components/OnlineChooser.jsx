import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playActions } from "../Store/play-slice";
import { connectToRoom } from "../Store/ttt-actions";
import { resetAll } from "../Functions/play-functions";

export default function OnlineChooser() {
  const [roomInput, setRoomInput] = useState("");
  const roomNo = useSelector((state) => state.play.roomNo);
  const multiplayerMode = useSelector((state) => state.play.multiplayerMode);
  const [unsub, setUnsub] = useState(null);

  // console.log("OnlineChooser multiplayer", multiplayerMode);
  const dispatch = useDispatch();

  // Online works by first fetching to see if there is a timestamp for player1 or player2
  // Then create a server timestamp and replace the oldest timestamp or null timestamp
  function onlineHandler() {
    dispatch(playActions.setMultiplayerMode("online"));
  }
  function localHandler() {
    resetAll(dispatch);
    dispatch(playActions.setMultiplayerMode("local"));
    if (unsub) {
      unsub.unsubFunc();
      console.log("Unsubscribed");
      setUnsub(null);
    }
  }
  async function roomSelectHandler() {
    // if (unsub) {
    // unsub.unsubFunc();
    //   console.log("Unsubscribed");
    //   setUnsub(null);
    // }
    const playerTimeStamp = Date.now();
    const unsubFunc = dispatch(connectToRoom(roomInput, playerTimeStamp));
    const tempUnsub = {
      unsubFunc,
    };
    console.log(unsubFunc);
    setUnsub(tempUnsub);
  }
  return (
    <div className="ttt-mode">
      <p className="inline">Multiplayer:</p>
      <button
        onClick={localHandler}
        className={multiplayerMode === "local" ? "ttt-selected" : ""}
      >
        Local
      </button>
      <button
        onClick={onlineHandler}
        className={multiplayerMode === "online" ? "ttt-selected" : ""}
      >
        Online
      </button>
      {multiplayerMode === "online" && !roomNo && (
        <>
          <input
            className="text-black px-2 h-8 w-16 rounded"
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Room"
          />
          <button className="bg-green-800" onClick={roomSelectHandler}>
            Go
          </button>
        </>
      )}
    </div>
  );
}

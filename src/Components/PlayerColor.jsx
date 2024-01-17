import { useSelector } from "react-redux";

export default function PlayerColor() {
  const currentPlayer = useSelector((state) => state.play.currentPlayer);
  const localPlayer = useSelector((state) => state.play.localPlayer);

  let textStyle = "text-xl font-bold p-1 ";
  if (localPlayer === "Red") textStyle += "text-red-300";
  if (localPlayer === "Blue") textStyle += "text-blue-300";
  return (
    <>
      <h1 className="text-xl font-bold p-1">{currentPlayer}'s turn to play</h1>
      {localPlayer && <h1 className={textStyle}>You are {localPlayer}</h1>}
    </>
  );
}

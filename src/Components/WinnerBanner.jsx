import { useSelector } from "react-redux";

export default function WinnerBanner() {
  const winner = useSelector((state) => state.play.winner);
  let textStyle = "text-xl font-bold p-1 ";
  if (winner === "Red") textStyle += "text-red-300";
  if (winner === "Blue") textStyle += "text-blue-300";
  return <>{winner && <h1 className={textStyle}>Congrats {winner} !!!</h1>}</>;
}

import { useSelector } from "react-redux";
import "./App.css";
import Grid from "./Components/Grid";
import Header from "./Components/Header";
import LevelChooser from "./Components/LevelChooser";
import OnlineChooser from "./Components/OnlineChooser";
import Reset from "./Components/Reset";
import TTTMode from "./Components/TTTMode";
import WinnerBanner from "./Components/WinnerBanner";
import PlayerColor from "./Components/PlayerColor";

function App() {
  const mode = useSelector((state) => state.play.mode);

  return (
    <div className="text-white flex flex-col justify-center items-center w-screen">
      <Header />
      <OnlineChooser />
      <TTTMode />
      {mode === "russian" && <LevelChooser />}
      <PlayerColor />

      <Reset />

      <WinnerBanner />
      <Grid></Grid>
    </div>
  );
}

export default App;

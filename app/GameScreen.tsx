import { usePlayers } from "./Context/PlayerContext";
const GameScreen = () => {
  const { players, setPlayers } = usePlayers();
  console.log(players);
};
export default GameScreen;

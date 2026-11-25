import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TicTacToe from "../components/Games/TicTacToe/TicTacToe";
import RockPaperScissors from "../components/Games/RockPaperScissors/RockPaperScissors";
import Snake from "../components/Games/Snake/Snake";
import TypingTest from "../components/Games/TypingTest/TypingTest";
import MemoryCardGame from "../components/Games/MemoryCardGame/MemoryCardGame";
import "./GamePlayPage.css";

const GAMES: Record<string, React.FC> = {
  tictactoe: TicTacToe,
  rps: RockPaperScissors,
  snake: Snake,
  typing: TypingTest,
  memory: MemoryCardGame,
};

const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const Game = gameId ? GAMES[gameId] : undefined;

  if (!Game) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="game-play">
      <Header />
      <main className="game-play__main">
        <motion.div
          className="game-play__container"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="game-play__frame">
            <div className="game-play__content">
              <Game />
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default GamePlayPage;
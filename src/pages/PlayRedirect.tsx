import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

/** Legacy `/play` and `/play?game=` URLs → per-game routes or home */
const PlayRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const game = searchParams.get("game");
  if (game) {
    return <Navigate to={`/games/${game}`} replace />;
  }
  return <Navigate to="/" replace />;
};

export default PlayRedirect;
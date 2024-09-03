import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
// import SignupFormPage from "../components/SignupFormPage";
import RoundFormPage from "../components/RoundForm/RoundFormPage";
import PlayersPage from "../components/PlayersPage/PlayersPage";
import MostRecentPage from "../components/MostRecentPage";
import Leaderboard from "../components/Leaderboard";
import HomePage from "../components/HomePage";

import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      // {
      //   path: "signup",
      //   element: <SignupFormPage />,
      // },
      {
        path: "rounds/new", // New route for RoundForm
        element: <RoundFormPage />,
      },
      {
        path: "players",
        element: <PlayersPage />,
      },
      {
        path: "rounds/recent",
        element: <MostRecentPage />,
      },
      {
        path: "leaderboard", // New route for LeaderboardPage
        element: <Leaderboard />,
      },
    ],
  },
]);

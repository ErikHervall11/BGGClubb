import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import RoundFormPage from "../components/RoundForm/RoundFormPage";
import PlayersPage from "../components/PlayersPage/PlayersPage";
import MostRecentPage from "../components/MostRecentPage";
import Leaderboard from "../components/Leaderboard";
import HomePage from "../components/HomePage";
import NewPlayerForm from "../components/NewPlayerForm/NewPlayerForm";
import Layout from "./Layout";
import { useEffect, useState } from "react";

const RootLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/") // Adjust this to your auth route
      .then((response) => response.json())
      .then((data) => {
        if (data.is_admin) {
          setIsAdmin(true);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  return <HomePage isAdmin={isAdmin} />; // Pass isAdmin to HomePage
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "rounds/new",
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
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "players/new",
        element: <NewPlayerForm />,
      },
    ],
  },
]);

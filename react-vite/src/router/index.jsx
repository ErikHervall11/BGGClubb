import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
// import SignupFormPage from "../components/SignupFormPage";
import RoundFormPage from "../components/RoundForm/RoundFormPage";
import PlayersPage from "../components/PlayersPage/PlayersPage";

import Layout from "./Layout";

function RecentRoundsPage() {
  return <h1>Most Recent Rounds</h1>;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
        element: <RecentRoundsPage />,
      },
    ],
  },
]);

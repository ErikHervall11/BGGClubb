import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img
            src="https://bad-girls-golf-club.s3.us-west-1.amazonaws.com/BGGClogo.png"
            alt="Logo"
            className="logo"
          />
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li className="navbarpages">
          <NavLink to="/players">Golfers</NavLink>
        </li>
        <li className="navbarpages">
          <NavLink to="/rounds/new">New Round</NavLink>
        </li>
        <li className="navbarpages">
          <NavLink to="/rounds/recent">Most Recent</NavLink>
        </li>
        <li className="navbarpages">
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </li>
        <li className="navbarpages">
          <NavLink to="/players/new">Add New Golfer</NavLink>
        </li>
      </ul>
      <div className="navbar-profile">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;

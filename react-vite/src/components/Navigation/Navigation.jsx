import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img
            src="../static/uploads/McginnisGolfCourse.png"
            alt="Logo"
            className="logo"
          />
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/players">Players</NavLink>
        </li>
        <li>
          <NavLink to="/rounds/new">Add New Round</NavLink>
        </li>
        <li>
          <NavLink to="/rounds/recent">Most Recent Rounds</NavLink>
        </li>
      </ul>
      <div className="navbar-profile">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;

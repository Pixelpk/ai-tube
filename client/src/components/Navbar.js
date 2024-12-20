import React from "react";
import Wrapper from "../styles/Navbar";
import GoogleAuth from "./GoogleAuth";
import { NavLink } from "react-router-dom";
import { AppsIcon, HamburgerIcon, LogoIcon, SettingsIcon } from "./Icons";
import Search from "./Search";
import { useAuth } from "../context/auth-context";
import UserDropdown from "./UserDropdown";
import UploadVideo from "./UploadVideo";
import SignIn from "./SignIn";

function Navbar({ toggleSidebarOpen }) {
  const user = useAuth();

  return (
    <Wrapper>
      <div className="logo flex-row">
        <HamburgerIcon
          onClick={toggleSidebarOpen}
          className="toggle-navhandler"
        />
        <span>
          <NavLink to="/">
            <LogoIcon
              style={{
                width: 80,
                height: 24,
                color: "white",
              }}
            />
          </NavLink>
        </span>
      </div>

      <Search />

      <ul>
        <li>{user ? <UploadVideo /> : <AppsIcon />}</li>
        <li>{user ? <AppsIcon /> : <SettingsIcon />}</li>
        <li>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <GoogleAuth />
              <SignIn />
            </div>
          )}
        </li>
      </ul>
    </Wrapper>
  );
}

export default Navbar;

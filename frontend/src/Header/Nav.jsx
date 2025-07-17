import React, { useState, useEffect } from "react";
import Link from "../shared/Link";
import Button from "../shared/Button";
import { API_ROOT } from "../../apiConfig";
import loginCheck from "../loginCheck";

function Nav({ navClass, linkClass }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const loggedIn = await loginCheck();
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    const res = await fetch(`${API_ROOT}/auth/logout`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (res.ok) {
      console.group("token removed");
    } else {
      console.log("cont remove token");
    }
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className={navClass}>
      <Link to="/" style={{ background: "var(--bg1)" }}>
        Home
      </Link>
      <Link to="/persons" style={{ background: "var(--bg1)" }}>
        People
      </Link>
      <Link to="/events" style={{ background: "var(--bg1)" }}>
        Events
      </Link>
      <Link to="/spectra" style={{ background: "var(--bg1)" }}>
        Spectra
      </Link>
      <Link to="/stances" style={{ background: "var(--bg1)" }}>
        Stances
      </Link>
      {isLoggedIn ? (
        <Button onClick={handleLogout} style={{ background: "var(--bg2)" }}>
          Logout
        </Button>
      ) : (
        <Link to="/login" style={{ background: "var(--bg2)" }}>
          Login
        </Link>
      )}
      {isLoggedIn ? (
        <>
          <Link to="user-details" style={{ background: "var(--bg2)" }}>
            My Account
          </Link>
          <Link to="users" style={{ background: "var(--bg2)" }}>
            Other Users
          </Link>
        </>
      ) : (
        <Link to="/register" style={{ background: "var(--bg2)" }}>
          Register
        </Link>
      )}
    </nav>
  );
}

export default Nav;

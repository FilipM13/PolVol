import React, { useState, useEffect } from "react";
import Link from "../shared/Link";
import Button from "../shared/Button";
import { API_ROOT } from "../../apiConfig";
import { myDetails } from "../loginCheck";
import Loading from "../shared/Loading";

function Nav({ navClass, linkClass }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getDetails() {
    setLoading(true);
    var u = await myDetails();
    setUser(u);
    setLoading(false);
  }

  useEffect(() => {
    getDetails();
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
      console.log("cant remove token");
    }
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (loading) return <Loading />;

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
      {user ? (
        <Button onClick={handleLogout} style={{ background: "var(--bg2)" }}>
          Logout
        </Button>
      ) : (
        <Link to="/login" style={{ background: "var(--bg2)" }}>
          Login
        </Link>
      )}
      {user ? (
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

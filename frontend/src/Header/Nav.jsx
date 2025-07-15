import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../shared/Button";
import {default as SharedLink} from "../shared/Link";
import { API_ROOT } from "../../apiConfig";
import loginCheck from "../loginCheck";

function Nav({ navClass, linkClass }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        const loggedIn = await loginCheck();
        setIsLoggedIn(loggedIn);
    };

    useEffect( () => {
        checkLoginStatus()
    },[]);

    const handleLogout = async () => {
        const res = await fetch(`${API_ROOT}/auth/logout`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + localStorage.getItem("token"),
            },
        });
        if (res.ok) {
            localStorage.removeItem("token");
        }
        window.location.reload();
    };
      
    return (
        <nav className={navClass}>
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/persons" className={linkClass}>People</Link>
            <Link to="/events" className={linkClass}>Events</Link>
            <Link to="/spectra" className={linkClass}>Spectra</Link>
            <Link to="/stances" className={linkClass}>Stances</Link>
            {isLoggedIn ? <Button onClick={handleLogout}>Logout</Button> : <SharedLink to="/login">Login</SharedLink>}
        </nav>
    );
}

export default Nav;
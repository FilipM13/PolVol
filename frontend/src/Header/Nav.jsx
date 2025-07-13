import { Link } from "react-router-dom";

function Nav({ navClass, linkClass }) {
    return (
        <nav className={navClass}>
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/persons" className={linkClass}>People</Link>
            <Link to="/events" className={linkClass}>Events</Link>
            <Link to="/spectra" className={linkClass}>Spectra</Link>
            <Link to="/stances" className={linkClass}>Stances</Link>
        </nav>
    );
}

export default Nav;
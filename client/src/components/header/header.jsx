import React from 'react';
import icon from "../../../src/assets/images/icon.jpeg";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const oneditor = location.pathname.includes("/editor");
    const headerClass = oneditor ? "c-header editor-header" : "c-header default-header";

    return (
        <>
            <header className={headerClass}>
                <nav>
                    <div className="logo">
                        <img className="collab-icon" src={icon} alt="collabsync" />
                        <div className="c-name">
                            <Link to="/" onClick={() => console.log('Redirecting to home')} className="home-link">
                                Collab Sync
                            </Link>
                        </div>
                    </div>
                    <ul className="nav-links">
                        <li><a href="#">Sign In</a></li>
                        <li><a href="#">Start Sharing</a></li>
                    </ul>

                </nav>
            </header>
        </>
    );
}

export default Header;

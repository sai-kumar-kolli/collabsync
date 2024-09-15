import React, { useState, useEffect } from 'react';
import icon from "../../../src/assets/images/icon.jpeg";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import { useDispatch, useSelector } from 'react-redux';
import SessionExpiryModal from '../../common/sessionExpiryModal';
import { socket } from '../../utils/socket'; // Import socket
import { getDocument } from '../../features/API/getDocument';

const Header = () => {
    const location = useLocation();
    const [showExtendButton, setShowExtendButton] = useState(false);
    const sessionData = useSelector(state => state.editor.sessionData);
    const oneditor = location.pathname.includes("/editor");
    const headerClass = oneditor ? "c-header editor-header" : "c-header default-header";
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Use the countdown timer hook, initialized with sessionData from context
    const { timeLeft, extendTime, isExpired } = useCountdownTimer(sessionData?.startTime, sessionData?.duration);

    // Show "Extend Session" button when the time left is less than 4 minutes
    useEffect(() => {
        if (timeLeft !== null && timeLeft <= 240000 && !sessionData?.extended) {
            setShowExtendButton(true);
        } else {
            setShowExtendButton(false);
        }
    }, [timeLeft, sessionData]);

    // Show modal when session expires
    useEffect(() => {
        if (isExpired) {
            setIsModalOpen(true);
        }
    }, [isExpired]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        handleSessionEnd(); // Emit session expiry and cleanup
        navigate("/");
    };

    // Emit session extension to the server
    const handleExtendSession = () => {
        socket.emit("extendSession", sessionData.sessionId); // Emit extend session event to the server

        // Listen for server response on session extension success
        socket.once("sessionExtended", (newSessionData) => {
            console.log(newSessionData);
            dispatch(getDocument(newSessionData.sessionId)); // Fetch the updated session data from the server
            extendTime(); // Reset the countdown timer
            setIsModalOpen(false); // Close the modal only after resetting the timer
        });

        // Handle session extension failure
        socket.once("sessionExtensionFailed", (errorData) => {
            console.log(errorData);
        });
    };

    // Emit session expiry to the server for cleanup
    const handleSessionEnd = () => {
        socket.emit("sessionExpiry", sessionData.sessionId); // Emit session expiry event for cleanup
    };

    // Convert milliseconds to minutes and seconds
    const formatTime = (timeInMs) => {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = ((timeInMs % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

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

                    {!oneditor ? (
                        <ul className="nav-links">
                            <li><a href="#">Sign In</a></li>
                            <li><a href="#">Start Sharing</a></li>
                        </ul>
                    ) : (
                        <ul className="nav-links">
                            {timeLeft !== null && (
                                <li className="session-info">
                                    <span>Time Left: {formatTime(timeLeft)}</span>
                                </li>
                            )}
                            {showExtendButton && (
                                <li>
                                    <button className="extend-session-btn" onClick={handleExtendSession}>
                                        Extend Session
                                    </button>
                                </li>
                            )}
                        </ul>
                    )}
                </nav>
            </header>
            <SessionExpiryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}

export default Header;

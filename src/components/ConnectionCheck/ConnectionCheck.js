import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConnectionCheck.css';

const ConnectionCheck = () => {
    const [isConnecting, setIsConnecting] = useState(true);
    const [message, setMessage] = useState('Server is booting up, please wait...');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await axios.get('https://tisha-dashboard-api.onrender.com/');
                setMessage(response.data.message);
                setTimeout(() => {
                    setIsConnecting(false);
                }, 1500); // Show success message for 1.5 seconds before fading out
            } catch (error) {
                setMessage('Server is booting up, please wait...');
                // Retry after 3 seconds if connection fails
                setTimeout(checkConnection, 3000);
            }
        };

        checkConnection();
    }, []);

    if (!isConnecting) return null;

    return (
        <div className={`connection-check ${!isConnecting ? 'fade-out' : ''}`}>
            <div className="connection-content">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ConnectionCheck; 
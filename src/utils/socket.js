import { io } from 'socket.io-client';
import config from '../config/config';

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(config.SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}; 
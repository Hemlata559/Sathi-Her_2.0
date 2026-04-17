
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import API_BASE_URL from '../utils/api';

export const SocketContext = createContext();

const socket = io(API_BASE_URL, {
    withCredentials: true
});

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

    }, []);



    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;

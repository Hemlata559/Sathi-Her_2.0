const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const rideService = require('./services/ride.service');

let io;

const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost'];
const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }

                return callback(new Error('Socket.IO CORS blocked this request.'));
            },
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data = {}) => {
            const { userId, userType } = data;

            if (userType === 'user' && userId) {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-user', async (data = {}) => {
            try {
                const { rideId, userId, location } = data;

                const tracking = await rideService.updateRideLiveLocation({
                    rideId,
                    userId,
                    location
                });

                const participants = [tracking.participants?.user, tracking.participants?.companion].filter(Boolean);

                participants.forEach((participant) => {
                    if (participant?.socketId) {
                        io.to(participant.socketId).emit('ride-live-location-updated', tracking);
                    }
                });
            } catch (error) {
                socket.emit('ride-live-location-error', { message: error.message });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            await userModel.findOneAndUpdate({ socketId: socket.id }, { $unset: { socketId: 1 } });
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };

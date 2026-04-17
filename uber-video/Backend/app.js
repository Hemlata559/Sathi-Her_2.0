const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const chatRoutes = require('./routes/chat.routes'); 
const companionRequestRoutes = require('./routes/companionRequest.routes');

connectToDb();

const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost'];
const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS policy blocked this request.'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);

app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
app.use('/chat', chatRoutes); 
app.use('/companion-requests', companionRequestRoutes);




module.exports = app;

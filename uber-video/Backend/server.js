import cors from 'cors';
import http from 'http';
import app from './app.js'; // note the .js extension
import { initializeSocket } from './socket.js'; // add .js if it's an ES module
const port = process.env.PORT || 3000;

// Apply CORS middleware first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

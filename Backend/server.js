require("dotenv").config();
const express = require("express");
const connectToDb = require("./db/db");


// Ensure this is in your server.js
//app.use(express.json());

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
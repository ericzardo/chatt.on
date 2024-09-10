const { Server } = require("socket.io");
const { socketConfig } = require('../config');

const io = (server) => new Server(server, socketConfig)

module.exports = io;
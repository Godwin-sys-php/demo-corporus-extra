const socketIo = require("socket.io");

class SocketService {
  constructor(server) {
    this.io = socketIo(server);
    this.io.on("connection", (socket) => {
      console.log("Hey");
      console.log("user connected");
      socket.on("heartbeat", (data) => {
        socket.emit("heartbeat", { time: Date.now() });
      });
    });
  }

  emiter(event, body) {
    if (body) this.io.emit(event, body);
  }

  broadcastEmiter(body, event) {
    if (body) this.io.emit(event, body);
  }
}

module.exports = SocketService;

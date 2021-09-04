import { io } from "socket.io-client";

class SocketioService {
  //Public field declarations
  // height=0;
  socket;
  constructor() {}

  setupSocketConnection() {

    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

    this.socket.emit("my message", "VUE 3 Composition API socket.io chat.");

    this.socket.on("my-broadcast", (data) => {
      console.log(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default SocketioService;

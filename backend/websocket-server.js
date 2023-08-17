const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    socket.send(
      JSON.stringify({ type: "info", message: `You sent: ${message}` })
    );
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "broadcast",
            message: `Broadcast: ${message}`,
          })
        );
      }
    });
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

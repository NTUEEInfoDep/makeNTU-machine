const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

type laserCutMaterialRequest = {
  id: number;
  finalMaterial: string;
};

type statusRequest = {
  id: number;
  status: string;
  timeCreated: Date;
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket: any) => {
    socket.on("threeDPQueue", (threeDPQueue: statusRequest) => {
      io.emit("threeDPQueue", threeDPQueue);
    });
    socket.on("laserCutQueue", (laserCutQueue: statusRequest) => {
      io.emit("laserCutQueue", laserCutQueue);
    });
    socket.on(
      "laserCutMaterial",
      (laserCutMaterial: laserCutMaterialRequest) => {
        io.emit("laserCutMaterial", laserCutMaterial);
      },
    );
  });

  httpServer
    .once("error", (err: any) => {
      console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server on http://${hostname}:${port}`);
    });
});

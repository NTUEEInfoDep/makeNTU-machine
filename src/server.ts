import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import type {
  broadcastStatusRequest,
  broadcastMaterialRequest,
  broadcastNewLaserCutReserveRequest,
  broadcastNewThreeDPReserveRequest,
} from "@/shared/types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket: any) => {
    socket.on("threeDPQueue", (threeDPQueue: broadcastStatusRequest) => {
      io.emit("threeDPQueue", threeDPQueue);
    });
    socket.on("laserCutQueue", (laserCutQueue: broadcastStatusRequest) => {
      io.emit("laserCutQueue", laserCutQueue);
    });
    socket.on(
      "laserCutMaterial",
      (laserCutMaterial: broadcastMaterialRequest) => {
        io.emit("laserCutMaterial", laserCutMaterial);
      },
    );
    socket.on(
      "newLaserCutReserveRequest",
      (newLaserCutReserveRequest: broadcastNewLaserCutReserveRequest) => {
        io.emit("newLaserCutReserveRequest", newLaserCutReserveRequest);
      },
    );
    socket.on(
      "newThreeDPReserveRequest",
      (newThreeDPReserveRequest: broadcastNewThreeDPReserveRequest) => {
        io.emit("newThreeDPReserveRequest", newThreeDPReserveRequest);
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

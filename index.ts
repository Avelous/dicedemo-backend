import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import * as cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import * as morgan from "morgan";
import adminRoutes from "./routes/admin";
import playerRoutes from "./routes/player";
import gameRoutes from "./routes/game";
import { Server } from "socket.io";
import * as http from "http";
import * as Pusher from "pusher";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      io?: Server;
    }
  }
}

/* CONFIGURATIONS */

dotenv.config();
export const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/**Pusher Setup */

export const pusher = new Pusher({
  appId: "1693689",
  key: "6fa5b078200dc7cc410e",
  secret: "c996bc7eda324f1f4c73",
  cluster: "mt1",
  useTLS: true,
});

/*Sockets Setup*/
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", socket => {
  console.log("A user connected to Socket");
  socket.on("disconnect", () => {
    console.log("A user disconnected from Sockets");
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL || "";

app.use("/admin", adminRoutes);
app.use("/player", playerRoutes);
app.use("/game", gameRoutes);

const connectWithRetry = () => {
  console.log("connecting");
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
      // server.listen(PORT, () => console.log(`Server Connected, Port: ${PORT}`));
    })
    .catch(error => {
      console.log(`${error} did not connect`);
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry();

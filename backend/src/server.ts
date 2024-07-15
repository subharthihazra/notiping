import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SERVER_PORT, WS_PORT } from "./config/env";
import authRouter from "./routes/auth";
import ErrorMiddleware from "./errorhandlers/ErrorMiddleware";
import connectDB from "./db/connect";
import startWSServer from "./socket/socket";

const app: Express = express();

// use CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
// parse cookie
app.use(cookieParser());

// Adding Auth Router
app.use("/auth", authRouter);

// ERROR middleware (must be in last)
app.use(ErrorMiddleware);

// basic api
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("notiping api");
});

const port = String(SERVER_PORT) || "5000";
const wsport = String(WS_PORT) || "5001";

startWSServer(parseInt(wsport));

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is listening on port ${port} ...`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

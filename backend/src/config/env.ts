import dotenv from "dotenv";
dotenv.config();

export const { SERVER_PORT, MONGO_URI, JWT_SECRET_KEY, WS_PORT } = process.env;

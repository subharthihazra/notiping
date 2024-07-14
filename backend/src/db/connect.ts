import { MONGO_URI } from "../config/env";
import mongoose from "mongoose";

export default function connectDB() {
  return mongoose.connect(String(MONGO_URI));
}

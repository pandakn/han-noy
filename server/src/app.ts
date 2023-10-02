import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import { connectToDatabase } from "./config/db";
import router from "./routes";

dotenv.config();
const PORT = process.env.PORT || 3000;

connectToDatabase();

const origin = [
  // "http://localhost:3000",
  "http://localhost:4200",
  process.env.ORIGIN,
];

const app = express();
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin,
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("dev"));

app.use("/api", router());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

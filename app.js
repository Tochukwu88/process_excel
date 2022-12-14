import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import env from "dotenv";
env.config();

/* init sequelize and load models */
// process.env.NODE_ENV can be production or development
import { sequelize, modelsLoader } from "./src/models/index.js";
const environment = process.env.NODE_ENV || "development"; // defaults to development environment

(async () => {
  try {
    await modelsLoader();

    console.log("...sequelize loaded, .");
  } catch (e) {
    console.error(e);
  }
})();
/* end sequelize and database initialization */

import adminStudentRouter from "./src/routes/admin/students.js";

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
const __dirname = path.resolve();
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", adminStudentRouter);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: `${err.name} : ${err.message}` });
  }
});

export default app;

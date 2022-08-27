import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import env from "dotenv";
env.config();

/* init sequelize and load models */
// process.env.NODE_ENV can be production or development
import { sequelize, modelsLoader } from "./src/models/index.js";
const environment = process.env.NODE_ENV || "development"; // defaults to development environment
// synchronize sequelize with database
(async () => {
  try {
    await modelsLoader();
    // do not destructively alter the database during prodction
    if (environment == "production") {
      console.log("...running in production mode...");
      await sequelize.sync(); // doesn't alter the database
    } else {
      console.log(`...running in ${environment} mode...`);
      await sequelize.sync({ alter: false }); // TODO change to true
    }
    console.log("...sequelize loaded,  database synced.");
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

app.use("/api", (req, res, next) => {
  // setup CORS
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/v1", adminStudentRouter);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: `${err.name} : ${err.message}` });
  }
});

export default app;

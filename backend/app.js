import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { static as expressStatic } from "express";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import logRouter from "./routes/log.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(expressStatic(join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/log", logRouter);
app.use(cookieParser());

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  if (req.app.get("env") === "development") {
    console.error(err.stack);
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

export default app;

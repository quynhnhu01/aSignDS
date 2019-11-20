const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const { URI } = require("./constants");

const { userRouter, gridRouter, emailRouter, contractRouter } = require("./routes/index");

const app = express();
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (!err) console.log("Connected to MongoDB");
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "build")));
app.use(cors());

app.use("/api", gridRouter);
app.use("/user", userRouter);
app.use("/", emailRouter);
app.use("/contract", contractRouter);
app.get("*", (req, res) => {
    res.sendFile("build/index.html", { root: __dirname });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// TODO Web Template Studio: Add your own error handler here.
if (process.env.NODE_ENV === "production") {
    // Do not send stack trace of error message when in production
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send("Error occurred while handling the request.");
    });
} else {
    // Log stack trace of error message while in development
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        console.log(err);
        res.send(err.message);
    });
}

module.exports = app;

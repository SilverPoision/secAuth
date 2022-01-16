const express = require("express");
const mongo = require("mongoose");
const user = require("./Routes/routes");
const verify = require("./Controller/Misc/auth-verify");
const errorHandler = require("./Controller/Misc/errorHandler");

const main = (app, mongodbURI) => {
  app.disable("etag");

  mongo.connect(
    mongodbURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Connected to DB");
    }
  );
  app.use(express.json());
  app.use(function (req, res, next) {
    res.header("X-Powered-by", "SecAuth-Express");
    next();
  });
  app.use("/api/", user);

  //404 error Handler
  app.use((req, res, next) => {
    return next(new errorHandler.AppError("You are on wrong way!!", 404));
  });

  //Error Handler
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };

  const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  };

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    mode = process.env.NODE_ENV || "production";

    if (mode === "development") {
      sendErrorDev(err, res);
    } else {
      sendErrorProd(err, res);
    }
  });
};

// const app = express();

// main(app, "mongodb://localhost:27017/users");
// app.listen(8000, (err) => {
//   if (err) {
//     console.log(err);
//   }
// });

module.exports.init = main;
module.exports.verifyUser = verify;
module.exports.errorHandler = errorHandler;

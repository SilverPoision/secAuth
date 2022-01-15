const express = require("express");
const router = express.Router();
const secauth = require("secauth");
const { AppError, catchAsync } = require("secauth").errorHandler;

router.get(
  "/user1/:id",
  secauth.verifyUser,
  catchAsync(async (req, res, next) => {
    if (req.params.id) {
      return next(new AppError("Error Message", 401));
    }
    return res.send({
      message: "This is a private route",
      user: req.user,
    });
  })
);

module.exports = router;

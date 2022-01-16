const express = require("express");
const router = express.Router();
const { verifyUser } = require("secauth");
const { AppError, catchAsync } = require("secauth").errorHandler;

router.get(
  "/user1/:id",
  verifyUser,
  catchAsync(async (req, res, next) => {
    if (req.params.id == "true") {
      return next(new AppError("Error Message", 401));
    }
    return res.send({
      message: "This is a private route",
      user: req.user,
    });
  })
);

module.exports = router;

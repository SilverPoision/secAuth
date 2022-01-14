const jwt = require("jsonwebtoken");
const User = require("../../Models/user");
const { catchAsync, AppError } = require("../Misc/errorHandler");

module.exports = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError("No token Provided", 400));
  }

  const verify = jwt.verify(token, process.env.JWT_SECRET);

  if (!verify) {
    return next(new AppError("Unauthorized", 401));
  }
  if (!verify.verified) {
    return next(new AppError("Please verify you email", 401));
  }
  const user = await User.findOne({ _id: verify._id });

  if (user.sessToken.indexOf(token) >= 0) {
    req.user = verify;
    return next();
  } else {
    return next(new AppError("Unauthorized", 401));
  }
});

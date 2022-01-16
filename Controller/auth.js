const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { catchAsync, AppError } = require("./Misc/errorHandler");
const User = require("../Models/user");
let mailBody;

try {
  mailBody = require(process.env.MAIL_PATH);
} catch {
  mailBody = require("./Misc/mailBody");
}

const {
  signupSchema,
  loginSchema,
  forgotSe,
  forgot_Valid,
  proEditSchema,
  nameEditSchema,
  emailEditSchema,
} = require("../Models/validate");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = signupSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const email = await User.findOne({ email: req.body.email });
  if (email) {
    if (!email.emailVerified) {
      const mailOption = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Confirm your Email!!",
        html: mailBody.confirmEmail(process.env.HOST, email.emailToken),
      };
      transport.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log("Mail Server is not working", err);
        }
      });
      return res.status(200).send({
        success: true,
        error: false,
        message: "User Exists verification email sent again!!",
      });
    } else {
      return next(new AppError("User Alredy Exists try to login!!", 400));
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return next(new AppError("Request failed!!", 500));
    }
    const token = buffer.toString("hex");
    user.emailToken = token;
    user.save();
    res.send({
      success: true,
      error: false,
      message: "User Created and verfication email sent!!",
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Confirm your Email!!",
      html: mailBody.confirmEmail(process.env.HOST, token),
    };
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log("Mail Server is not working", err);
      }
      return;
    });
  });
});

exports.login = catchAsync(async (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  const { error } = loginSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("Email or password incorrect", 401));
  }

  if (!user.emailVerified) {
    return next(new AppError("Please verify you email!!", 401));
  }

  const validePass = await bcrypt.compare(password, user.password);

  if (!validePass) {
    return next(new AppError("Email or password incorrect", 401));
  }
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      verified: user.emailVerified,
      sign: user.admin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "6h",
    }
  );
  user.sessToken.push(token);

  const filtered = [];
  let verify;

  user.sessToken.map((el) => {
    try {
      verify = jwt.verify(el, process.env.JWT_SECRET);
      if (verify) {
        filtered.push(el);
      }
    } catch (err) {}
  });
  user.sessToken = filtered;

  user.save();

  return res.status(200).send({
    success: true,
    error: false,
    message: "Login successful",
    token: token,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  let user = await User.findOne({ _id: req.user._id });
  filtered = [];
  user.sessToken.map((el) => {
    if (el != token) {
      filtered.push(el);
    }
  });
  user.sessToken = filtered;
  user.save();
  res.status(200).send({ success: true, error: false, message: "Logout done" });
});

exports.forgotSend = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const { error } = forgotSe(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return next(new AppError("Request failed!!", 500));
    }
    const token = buffer.toString("hex");
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).send({
        succes: true,
        error: false,
        message: "Password reset token sent to email if it exists!",
      });
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.save();
    res.status(200).send({
      succes: true,
      error: false,
      message: "Password reset token sent to email if it exists!",
    });
    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your Password!!",
      html: mailBody.reset(process.env.HOST, token),
    };
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log("Mail Server is not working", err);
      }
      return;
    });
  });
});

exports.forgetValidate = catchAsync(async (req, res, next) => {
  const token = req.params.id;
  if (!token) {
    return next(new AppError("No Token Supplied!!", 400));
  }
  const { error } = forgot_Valid(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or Expired Token Supplied!!", 400));
  }
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  user.password = hash;
  user.save();

  return res.status(200).send({
    success: true,
    error: false,
    message: "Password Reset Successfull!!",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.id;

  if (!token) {
    return next(new AppError("No Token Supplied!!", 400));
  }

  const user = await User.findOne({ emailToken: token });
  if (!user) {
    return next(new AppError("Expired or Invalid Token", 401));
  }

  user.emailVerified = true;
  user.emailToken = undefined;
  user.save();

  return res.status(200).send({
    succes: false,
    error: true,
    message: "Email Verified",
  });
});

exports.user = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    _id: req.user._id,
  });
  if (!user) {
    return next(new AppError("No user Found!!", 401));
  }
  user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  };

  res.status(200).send({
    success: true,
    error: false,
    user,
  });
});

exports.editProfile = catchAsync(async (req, res, next) => {
  let data = {
    name: req.body.name,
  };
  if (
    req.body.currentpassword &&
    req.body.newpassword &&
    req.body.confirmnewpassword
  ) {
    data = {
      currentPassword: req.body.currentpassword,
      newPassword: req.body.newpassword,
      confirmNewPassword: req.body.confirmnewpassword,
    };
    const { error } = proEditSchema(req.body);
    if (error) {
      return next(new AppError(error.details[0].message), 401);
    }

    if (req.body.newpassword !== req.body.confirmnewpassword) {
      return next(new AppError("Both Password should match!!", 401));
    }

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return next(new AppError("No user found!", 401));
    }
    const comparePass = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!comparePass) {
      return next(new AppError("Current Password don't match!!", 401));
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(data.newPassword, salt);
    user.password = hash;
    user.save();
    return res.status(200).send({
      success: true,
      error: false,
      message: "Profile Updated",
    });
  }
  //Validation
  const { error } = nameEditSchema(req.body);
  if (error) {
    return next(new AppError(error.details[0].message), 401);
  }

  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return next(new AppError("No user found!!", 401));
  }

  user.name = data.name;
  user.save();
  res.status(200).send({
    success: true,
    error: false,
    message: "Name Updated",
  });
});

exports.editEmail = catchAsync(async (req, res, next) => {
  const { error } = emailEditSchema(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 401));
  }
  // console.log(bc);
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return next(new AppError("No user found!!", 401));
  }

  if (user.email == req.body.email) {
    return next(new AppError("Please use a different email!!", 401));
  }

  const bc = await bcrypt.compare(req.body.currentpassword, user.password);

  if (!bc) {
    return next(new AppError("Current password doesn't match!!"));
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return next(new AppError("Request failed!!", 500));
    }
    const token = buffer.toString("hex");
    user.email = req.body.email;
    user.emailVerified = false;
    user.emailToken = token;
    user.sessToken = undefined;
    user.save();
    res.send({
      success: true,
      error: false,
      message: "Email changed and verfication email sent!!",
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Confirm your Email!!",
      html: mailBody.confirmEmail(process.env.HOST, token),
    };
    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log("Mail Server is not working", err);
      }
      return;
    });
  });
});

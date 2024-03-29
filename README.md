![SecAuth Logo](Images/logo.png)

SecAuth is a secure implementation of the user authentication model with added best practices for day to day developers needs. SecAuth can be used in your next Node-Express project to implement the most basic user authentication yet secure than most of the websites out there.

```js
const express = require("express");
const app = express();
const secAuth = require("secauth");

secAuth.init(app, "mongoDB_URL");

app.listen(5000);
```

## Installation

```
$ npm install secauth
```

## Features

- A secure and tested code for the User Authentication
- Extensively customisable
- Quick to implement and Ready to be Productionized

## Documentation

### The User Model:

```js
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 10,
    max: 525,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailToken: {
    type: String,
  },
  sessToken: [
    {
      type: String,
      default: null,
    },
  ],
```

### Update the environment variables:

Update all the variables in .env file or in the OS env variables so that the node process can read and use them.

1. `EMAIL` and `PASSWORD` are email and password of you mail server. **Recommended:** Use Gmail and turn on less secure apps.
2. `JWT_SECRET` is the secret key you want to encrypt the JWT token with
3. `HOST` is the host name that you want to use in the mail-body while sending emails. `Ex: HOST="localhost:8000"`
4. `MAIL_PATH` set it if you are using your own mail-body file.
5. `NODE_ENV` set it to handle the errors while in development mode and production also. `Ex: NODE_ENV="development" or NODE_ENV="production"`

### Checking if the request is authenticated:

In your routes add the `verifyUser` middleware exposed by Secauth and it will validate if the user is authenticated or not and if the user is authenticated it will assign `req.user` to the user variable that contains `User` object that can be used to run DB operation on the user.

```js
const express = require("express");
const router = express.Router();
const { verifyUser } = require("secauth");

router.get("/user1", verifyUser, (req, res, next) => {
  return res.send({
    "message": "This is a private route",
    "user": req.user,
  });
});

module.exports = router;
```

### Changing the Email Body:

If you want to change the email body that is sent every-time the user gets a verification email or password reset email then create a file and export two functions that accepts two arguments that are `token, host` just like in the [file](https://github.com/SilverPoision/secAuth/blob/main/Controller/Misc/mailBody.js) and then update the `MAIL_PATH` variable in the .env file or if on server then add the variable in environment variables and update the value.

If you are using your own mailBody file then update the `MAIL_PATH` with `../../../path_to_your_file` because the file that uses that file seats inside 2 levels deep in node_modules folder.

### Adding the Error Handler:

If you want to add error handlers in your code then you can import the errorHandler function from the Secauth lib and use it to properly handle errors and send user a proper message about what happened.

```js
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

```

#### API documentation can be found [here](https://documenter.getpostman.com/view/6036498/UVXjJvra).

## To-Do's:
- Implement various auth providers like Google, Twitter etc.

## Issues

As this is the first release of secAuth, it might contain some issues and bugs(I am sure that it has😆) and I will be more than happy(As much happy that I will scream with joy!!) to hear about them (Even a small spelling or grammatical issue will help grow the project) via [Github](https://github.com/SilverPoision/secAuth/issues) issues. Just open an issue and I will surely have a look at the bug/issue.

## Contribution

[Contributing Guide](https://github.com/SilverPoision/secAuth/blob/main/Contribution.md)

## People

- [@Piyush Kumar](https://twitter.com/silverpoision) is the original author of [SecAuth](https://github.com/SilverPoision/secAuth)

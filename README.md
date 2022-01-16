![SecAuth Logo](Images/logo.png)

SecAuth is a secure implementation of the user authentication model with added best practices for day to day developers needs. SecAuth can be used in your next project to implement the most basic user authentication yet secure than most of the websites there.

```js
const express = require("express");
const app = express();
const secAuth = require("secauth");

secAuth.init(app, "mongoDB_URL");

app.listen(5000);
```

# Installation

```
$ npm install secauth
```

# Features

- A secure and tested code for the User Authentication
- Extensively customizable
- Quick to implement and Ready to be Productionized

# Documentation

### Update the environment variables

Update all the variables in .env file or in the OS env variables so that the node process can read and use them.

1. `EMAIL` and `PASSWORD` are email and password of you mail server. **Recommended** Use Gmail and turn on less secure apps.
2. `JWT_SECRET` is the secret key you want to encrypt the jwt token with
3. `HOST` is the host name that you want to use in the mailbody while sending emails. `Ex: HOST="localhost:8000"`
4. `MAIL_PATH` set it if you are using your own mailbody file.
5. `NODE_ENV` set it to handle the errors while in development mode and prodution also. `Ex: NODE_ENV="development" or NODE_ENV="production"`

### Checking if the request is authenticated:

In your routes add the `verifyUser` middleware exposed by secauth and it will validate if the user is authenticated or not and if the user is authenticated it will assign `req.user` to the user variable that contains `ID, NAME, VERIFIED` that can be used to run DB operation on the user.

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

If you want to change the email that is sent everytime the user gets a verification email or password reset email then create a file and export two funtions that accepts two arguments that are `token, host` just like in the [file](https://github.com/SilverPoision/secAuth/blob/main/Controller/Misc/mailBody.js) and then update the `MAIL_PATH` variable in the .env file or if on server then add the variable in environment variables and update the value.

If you are using your own mailBody file then update the `MAIL_PATH` with `../../path_to_your_file` because the file that uses that file seats inside 1 level deep in node_modules folder.

### Adding the Error Handler:

If you want to add error handlers in your code then you can import the errorHandler funtion from the secauth lib and use it to properley handle errors and send user a proper message about what happenned.

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

### Full documentation can be find [here](https://documenter.getpostman.com/view/6036498/UVXjJvra).

# Issues

As this is the first realese of secAuth it might contain some issues and bugs and I am more than happy to hear about them via [github](https://github.com/SilverPoision/secAuth/issues) issues just open a issue and I will surely have a look at the bug/issue.

# Contribution

[Contributing Guide](https://github.com/SilverPoision/secAuth/blob/main/Contribution.md)

# People

- [@Piyush Kumar](https://twitter.com/silverpoision) is the original author of [SecAuth](https://github.com/SilverPoision/secAuth)

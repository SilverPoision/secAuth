const express = require("express");
const app = express();
const secAuth = require("secauth");
const user = require("./Routes/routes");

app.use("/api/", user);
secAuth.main(app, "mongodb://localhost:27017/users");

app.listen(2000, (err) => {
  if (err) {
    console.log(err);
  }
});

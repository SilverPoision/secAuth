const express = require("express");
const router = express.Router();
const secauth = require("secauth");

router.get("/user1", secauth.verifyUser, (req, res, next) => {
  return res.send({
    message: "This is a private route",
  });
});

module.exports = router;

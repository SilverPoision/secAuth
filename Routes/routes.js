const express = require("express");
const router = express.Router();
const auth = require("../Controller/auth");
const verifyAuth = require("../Controller/Misc/auth-verify");

router.post("/user/signup", auth.signup);
router.post("/user/login", auth.login);
router.post("/user/forgot", auth.forgotSend);
router.post("/user/forgot/:id", auth.forgetValidate);
router.post("/user", verifyAuth, auth.editProfile);
router.post("/user/email", verifyAuth, auth.editEmail);
router.post("/user/delete", verifyAuth, auth.deleteUser);

router.get("/user/verify/:id", auth.verifyEmail);
router.get("/user/logout", verifyAuth, auth.logout);
router.get("/user", verifyAuth, auth.user);

module.exports = router;

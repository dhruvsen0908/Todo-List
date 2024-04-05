const express = require("express");
const router = express.Router();

const signup = require("./Auth/signupRoutes");
const signin = require("./Auth/signinRoutes");

router.use("/signup", signup);
router.use("/signin", signin);

router.get("/logout", (req, res) => {
    req.session.user_id = null;
    req.flash("success", "You have been successfully logged out.");
    res.redirect("/");
});

module.exports = router;

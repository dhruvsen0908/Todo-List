const express = require("express");
const router = express.Router();

const User = require("../../models/user");

router.get("/", (req, res) => {
    res.render("signinPage", {
        user_id: req.session.user_id,
        message: req.flash("danger"),
    });
});

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findAndValidate(email, password);
    if (user) {
        req.session.user_id = user._id;
        req.flash("success", "You have been successfully logged in.");
        res.redirect("/");
    } else {
        req.flash("danger", "Username/Password combination is incorrect");
        res.redirect("/signin");
    }
});

module.exports = router;

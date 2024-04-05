const express = require("express");
const router = express.Router();

const User = require("../../models/user");

router.get("/", (req, res) => {
    res.render("signupPage", { user_id: req.session.user_id });
});

router.post("/", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const newUser = new User({
        firstname,
        lastname,
        email,
        password,
    });
    await newUser.save();
    console.log(`Made new user with id: ${newUser._id}`);
    res.redirect("/");
});

module.exports = router;

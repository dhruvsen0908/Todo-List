const express = require("express");
const router = express.Router();

const Work = require("../models/work");
const User = require("../models/user");

const requireSignIn = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect("/signin");
    }
    next();
};

router.get("/", async (req, res) => {
    if (req.session.user_id) {
        let currentUser = await User.findOne({ _id: req.session.user_id });
        await currentUser.populate("tasks");
        let allTasks = currentUser.tasks;

        return res.render("list", {
            allTasks,
            user_id: req.session.user_id,
            message: req.flash("success"),
        });
    }
    let message = req.flash("success");
    if (!message) message = [];
    res.render("list", { user_id: req.session.user_id, message });
});

router.post("/new", requireSignIn, async (req, res) => {
    const { title, desc, priority } = req.body;
    const newTask = new Work({
        title: title,
        desc: desc,
        priority: priority,
        user_id: req.session.user_id,
    });
    await newTask.save();
    res.redirect("/");
});

router.delete("/:id", requireSignIn, async (req, res) => {
    const { id } = req.params;
    await Work.deleteOne({ _id: id });
    res.redirect("/");
});

router.put("/edit/:id", requireSignIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, priority } = req.body;
    await Work.updateOne({ _id: id }, { title, desc: description, priority });
    res.redirect("/");
});

module.exports = router;

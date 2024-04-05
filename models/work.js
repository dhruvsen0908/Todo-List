const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    priority: {
        type: String,
        require: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
});

taskSchema.post("save", async function (next) {
    const currentUser = await User.findById(this.user_id);
    currentUser.tasks.push(this);
    await currentUser.save();
});

taskSchema.post(
    "deleteOne",
    { document: true, query: false },
    async function (doc, next) {
        const currentUser = await User.findOne({ _id: doc.user_id });
        currentUser.tasks.pull({
            _id: new mongoose.Types.ObjectId(this.id),
        });
        await currentUser.save();
    }
);

const Work = mongoose.model("Work", taskSchema);

module.exports = Work;

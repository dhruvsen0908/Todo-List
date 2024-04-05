const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Work",
        },
    ],
});

userSchema.statics.findAndValidate = async function (email, password) {
    const foundUser = await this.findOne({ email });
    if (!foundUser) return false;
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

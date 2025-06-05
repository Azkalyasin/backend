import mongoose from "mongoose";

const UserSchema = await new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
})

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
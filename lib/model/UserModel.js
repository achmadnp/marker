import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(Date.now()),
  },
  fullname: {
    type: String,
    default: `user-undefined`,
  },
  email: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userRoles",
    },
  ],
  inbox: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tables",
    },
  ],
});

let Dataset = mongoose.models.users || mongoose.model("users", userSchema);

export default Dataset;

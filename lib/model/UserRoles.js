import mongoose from "mongoose";

const UserRole = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: "associate",
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organisations",
  },
});

let Dataset =
  mongoose.models.userRoles || mongoose.model("userRoles", UserRole);

export default Dataset;

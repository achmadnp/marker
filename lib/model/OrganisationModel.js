import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  orgCode: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "projects" }],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

let Dataset =
  mongoose.models.organisations ||
  mongoose.model("organisations", organisationSchema);

export default Dataset;

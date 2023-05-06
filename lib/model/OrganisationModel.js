import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  orgUUID: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "projects" }],
});

let Dataset =
  mongoose.models.organisations ||
  mongoose.model("organisations", organisationSchema);

export default Dataset;

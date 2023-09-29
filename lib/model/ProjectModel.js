import mongoose from "mongoose";

// todo
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectTimespan: {
    type: [Date],
    default: [Date.now(), Date.now()],
  },
  projectAsignee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  projectStatus: {
    type: String,
    required: true,
    default: "notStarted",
  },

  latestUpdated: {
    type: Date,
    required: true,
  },

  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organisations",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
});

let Dataset =
  mongoose.models.projects || mongoose.model("projects", projectSchema);

export default Dataset;

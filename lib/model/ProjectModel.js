import mongoose from "mongoose";

// todo
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectTimespan: {
    type: [Date],
    default: [],
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

  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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

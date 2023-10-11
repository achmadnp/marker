import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskData: [mongoose.Schema.Types.Mixed],
  // changelog: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "taskChangelogs",
  // },
  // attachments: [
  //   { type: mongoose.Schema.Types.ObjectId, ref: "taskAttachments" },
  // ],
});

let Dataset = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default Dataset;

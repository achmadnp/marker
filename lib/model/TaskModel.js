import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  PIC: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

  taskStatus: {
    type: String,
    required: true,
    default: "assigned",
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  changelog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "taskChangelogs",
  },
  attachments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "taskAttachments" },
  ],
});

let Dataset = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default Dataset;

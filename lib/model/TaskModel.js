import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  PIC: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  attachmentCount: {
    type: Number,
    default: 0,
  },
  taskStatus: {
    type: String,
    required: true,
    default: "assigned",
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

let Dataset = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default Dataset;

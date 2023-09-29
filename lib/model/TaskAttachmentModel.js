import mongoose from "mongoose";

const taskAttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

let Dataset =
  mongoose.models.taskAttachments ||
  mongoose.model("taskAttachments", taskAttachmentSchema);

export default Dataset;

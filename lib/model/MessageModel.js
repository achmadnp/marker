import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  timestamp: {
    type: Date,
  },
  body: {
    type: String,
  },
});

let Dataset =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default Dataset;

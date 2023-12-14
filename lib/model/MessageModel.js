import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    datetime: {
      type: Date,
      required: true,
      default: new Date(Date.now()),
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFavMarked: {
      type: Boolean,
      required: true,
      default: false,
    },
    message: {
      type: String,
    },
  },
  {
    useStrict: false,
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default Dataset;

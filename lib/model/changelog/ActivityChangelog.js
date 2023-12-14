import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tables",
    },
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "datas",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    datetime: {
      type: Date,
      default: Date.now,
    },
    operation: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

let Dataset =
  mongoose.models.activitylogs ||
  mongoose.model("activitylogs", ActivityLogSchema);

export default Dataset;

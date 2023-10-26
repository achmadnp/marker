import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    // data: [mongoose.Schema.Types.Mixed],
    taskRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasktables",
    },
  },
  {
    strict: false,
  }
);

let Dataset = mongoose.models.datas || mongoose.model("datas", dataSchema);

export default Dataset;

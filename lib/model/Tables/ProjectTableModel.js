import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    tablefields: [{ type: mongoose.Schema.Types.ObjectId, ref: "tablefields" }],
    data: [{ type: mongoose.Schema.Types.ObjectId, ref: "datas" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    joincode: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "activitylogs" }],
    pendinginvites: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    maintainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  {
    useStrict: false,
    timestamps: true,
  }
);

let Dataset = mongoose.models.tables || mongoose.model("tables", tableSchema);

export default Dataset;

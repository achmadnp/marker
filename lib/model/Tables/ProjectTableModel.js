import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tablefields: [{ type: mongoose.Schema.Types.ObjectId, ref: "tablefields" }],
    data: [{ type: mongoose.Schema.Types.ObjectId, ref: "datas" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  {
    useStrict: false,
  }
);

let Dataset = mongoose.models.tables || mongoose.model("tables", tableSchema);

export default Dataset;

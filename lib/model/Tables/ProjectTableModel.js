import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tablefields: [{ type: mongoose.Schema.Types.ObjectId, ref: "tablefields" }],
  data: [{ type: mongoose.Schema.Types.ObjectId, ref: "datas" }],
});

let Dataset = mongoose.models.tables || mongoose.model("tables", tableSchema);

export default Dataset;

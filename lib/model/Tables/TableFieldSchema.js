import mongoose from "mongoose";

const tableFieldSchema = new mongoose.Schema({
  headerName: String,
  dataKey: String,
  cellType: String,
  resizeable: {
    type: Boolean,
    default: false,
  },
  cellName: String,
  modifier: mongoose.Schema.Types.Mixed,
  editableCol: {
    type: Boolean,
    default: true,
  },
  ddPool: { type: mongoose.Schema.Types.ObjectId, ref: "ddpools" },
});

let Dataset =
  mongoose.models.tablefields ||
  mongoose.model("tablefields", tableFieldSchema);

export default Dataset;

import mongoose from "mongoose";

const taskTableSchema = new mongoose.Schema({
  tablefields: [{ type: mongoose.Schema.Types.ObjectId, ref: "tablefields" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tasks" }],
});

let Dataset =
  mongoose.models.tasktables || mongoose.model("tasktables", taskTableSchema);

export default Dataset;

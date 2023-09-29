import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  data: [mongoose.Schema.Types.Mixed],
});

let Dataset = mongoose.models.datas || mongoose.model("datas", dataSchema);

export default Dataset;

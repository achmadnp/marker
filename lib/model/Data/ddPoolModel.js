import mongoose from "mongoose";

const ddPoolSchema = new mongoose.Schema({
  name: String,
  pools: [String],
});

let Dataset =
  mongoose.models.ddpools || mongoose.model("ddpools", ddPoolSchema);

export default Dataset;

import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  header: {
    type: String,
  },
  body: {
    type: String,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  timestamp: {
    type: Date,
  },
});

let Dataset = mongoose.models.logSchema || mongoose.model('logs', logSchema);

export default Dataset;

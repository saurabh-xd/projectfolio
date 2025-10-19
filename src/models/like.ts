// models/Like.js
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate likes
likeSchema.index({ user: 1, project: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', likeSchema);
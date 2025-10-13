import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true },

    projectId: { 
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true },
  },
  { timestamps: true }
);

// prevent same user liking twice
LikeSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const LikeModel = mongoose.models.Like || mongoose.model("Like", LikeSchema);
export default LikeModel;

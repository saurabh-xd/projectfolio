import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    liveLink: {
      type: String,
      required: true,
    },
    repoLink: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default ProjectModel;

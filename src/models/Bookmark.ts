import mongoose from "mongoose";


const bookmarkSchema = new mongoose.Schema({
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
})

// Prevent duplicate likes
bookmarkSchema.index({ user: 1, project: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
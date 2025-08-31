
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentText: {
      type: String,
      required: [true, "comment is required"],
    },

    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "Author is required"],
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog", 
        required: [true, "postId is required"],
    }
  },
  {
    timestamps: true, 
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

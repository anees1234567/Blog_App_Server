
const { NotFoundError } = require("@/utility/errors");
const Blog = require("@models/blogModel/blogModel"); 
 const Comment = require("@models/blogModel/commentModel");


async function getAllBlogService(req) {
  try {
    const page = parseInt(req.body.page) || 0;
    const limit = parseInt(req.body.limit) || 10;
    const searchText = req.query.searchText || "";

    if (isNaN(page) || page < 0) throw new Error("Invalid page number");
    if (isNaN(limit) || limit <= 0) throw new Error("Invalid page size");

    const skip = (page-1) * limit;
    const filter = {};
    if (searchText) {
      filter.title = { $regex: searchText, $options: "i" };
    }

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name email _id avatar") 
        .exec(),
      Blog.countDocuments(filter).exec(),
    ]);

    const formattedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      author: blog.authorId,
      authorId: undefined,
    }));

    return {
      items: formattedBlogs,
      totalCount: totalBlogs,
    };
  } catch (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}



async function getBlogsByUserService(userId) {
  try {
    console.log(userId);

    const blogs = await Blog.find({ authorId: userId })
      .populate("authorId", "name email avatar _id") 
      .exec();

    if (!blogs || blogs.length === 0) {
      throw new NotFoundError("No blogs found for this user");
    }

    // Format blogs: replace authorId with `author`
    const formattedBlogs = blogs.map((blog) => {
      const blogObj = blog.toObject();
      return {
        ...blogObj,
        author: blogObj.authorId, 
        authorId: undefined, 
      };
    });

    return formattedBlogs;
  } catch (error) {
    console.error("Error fetching blogs by user:", error);
    if(error instanceof NotFoundError){
        throw error
    }else{
        throw new Error("Not Found Error")
    }
  }
}


// Create new blog
async function createBlogService(data) {
  try {
    const newBlog = new Blog(data);
    const savedBlog = await newBlog.save();
    return savedBlog;
  } catch (error) {
    console.error("Error in adding blog:", error);
     throw new Error("Failed to add blog.");
  }
}


async function updateBlogService(data) {
  try {
    const body = {};
    if (data?.title) body.title = data.title;
    if (data?.content) body.content = data.content;
    if (data?.authorId) body.authorId = data.authorId;

    const updatedBlog = await Blog.findByIdAndUpdate(data?.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      throw new NotFoundError("Blog not found for update.");
    }
    return updatedBlog;
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new Error("Failed to update blog.");
    }
  }
}

// Delete blog
async function deleteBlogService(Id) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(Id);
    if (!deletedBlog) {
      throw new NotFoundError("Blog not found for deletion.");
    }
    return deletedBlog;
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new Error("Failed to delete blog.");
    }
  }
}

async function addCommentToBlogService(data){
    try {
     
       const blog = await Blog.findById(data?.postId);
        if(!blog){
            throw new NotFoundError("Blog not found for adding comment.");
        }
        const newComment = new Comment(data);
        const savedComment = await newComment.save();  
        if(!savedComment){
            throw new Error("Failed to add comment.");
        }
        return savedComment;
    } catch (error) {
        console.error("Error adding comment to blog:", error);
        if (error instanceof NotFoundError) {
            throw error;
        } else {
            throw new Error("Failed to add comment to blog.");
        }
}
}

async function getCommentsByBlogService(blogId) {
    try {
        const comments = await Comment.find({ postId: blogId })
        .populate("posterId", "name email avatar _id") 
        .exec();
  
      if (!comments || comments.length === 0) {
        throw new NotFoundError("No comments found for this blog");
      }
  
      return comments;
    } catch (error) {
      console.error("Error fetching comments by blog:", error);
      if(error instanceof NotFoundError){
          throw error
      }else{
          throw new Error("Not Found Error")
      }
    }
  }

async function deleteCommentService(commentId) {
    try {
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
        throw new NotFoundError("Comment not found for deletion.");
      }
      return deletedComment;
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new Error("Failed to delete comment.");
      }
    }
  }






module.exports = {
  getAllBlogService,
  getBlogsByUserService,
  createBlogService,
  updateBlogService,
  deleteBlogService,
  deleteCommentService,
  addCommentToBlogService,
  getCommentsByBlogService,
};

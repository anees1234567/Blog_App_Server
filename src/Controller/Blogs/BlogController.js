const blogService = require("@services/blogServices/blogService");
const { BadRequestError } = require("@/utility/errors");

async function getAllBlog(req, res, next) {
  try {
    const result = await blogService.getAllBlogService(req);
    res.success(200, result, "Blogs fetched successfully");
  } catch (error) {
    next(error);
  }
}

async function getBlogById(req, res, next) {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      throw new BadRequestError("Blog id not found");
    }
    const blog = await blogService.getBlogsByUserService(blogId);
    res.success(200, blog, "Blog details fetched successfully");
  } catch (error) {
    next(error);
  }
}

async function addBlog(req, res, next) {
  try {
    const { title, content, authorId, id } = req.body;

    // sanitize: only allow required fields
    if (!title || !content ||  !authorId) {
      throw new BadRequestError("All fields (title, content,  authorId) are required");
    }

    if (id) {
      const result = await blogService.updateBlogService({ id, title, content,  authorId });
      res.success(200, { title: result.title }, "Blog updated successfully");
    } else {
      const result = await blogService.createBlogService({ title, content,  authorId });
      res.success(200, { title: result.title }, "Blog created successfully");
    }
  } catch (error) {
    next(error);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      throw new BadRequestError("Blog id not found");
    }
    const result = await blogService.deleteBlogService(blogId);
    res.success(200, result, "Blog deleted successfully");
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const { postId, commentText, posterId } = req.body;

    if (!postId || !commentText || !posterId) {
      throw new BadRequestError("invalid request data");
    }

    const result = await blogService.addCommentToBlogService({ postId, commentText, posterId });
    res.success(200, result, "Comment added successfully");
  } catch (error) {
    next(error);
  }
}

async function getCommentsByBlogId(req, res, next) {
  try {
    const blogId = req.params.id;
    if (!blogId) {
      throw new BadRequestError("Blog id not found");
    }
    const comments = await blogService.getCommentsByBlogService(blogId);
    res.success(200, comments, "Comments fetched successfully");
  } catch (error) {
    next(error);
  } 
}

async function deleteComment(req, res, next) {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      throw new BadRequestError("Comment id not found");
    }
    const result = await blogService.deleteCommentService(commentId);
    res.success(200, result, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBlog,
  getBlogById,
  addBlog,
  deleteBlog,
  createComment,
  getCommentsByBlogId,
  deleteComment
};

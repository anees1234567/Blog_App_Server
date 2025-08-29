const blogService = require("@services/blogService/blogService");
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
    const blog = await blogService.getBlogByIdService(blogId);
    res.success(200, blog, "Blog details fetched successfully");
  } catch (error) {
    next(error);
  }
}

async function addBlog(req, res, next) {
  try {
    const { title, content, tag, authorId, id } = req.body;

    // sanitize: only allow required fields
    if (!title || !content || !tag || !authorId) {
      throw new BadRequestError("All fields (title, content, tag, authorId) are required");
    }

    if (id) {
      const result = await blogService.updateBlogService({ id, title, content, tag, authorId });
      res.success(200, { title: result.title }, "Blog updated successfully");
    } else {
      const result = await blogService.createBlogService({ title, content, tag, authorId });
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

module.exports = {
  getAllBlog,
  getBlogById,
  addBlog,
  deleteBlog,
};

// services/blogService.js
const { NotFoundError } = require("@/utility/errors");
const Blog = require("@models/blogModel/blogModel"); 

// Get all blogs with pagination + search
async function getAllBlogService(req) {
  try {
    const page = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.pageSize) || 10;
    const searchText = req.query.searchText || "";

    if (isNaN(page) || page < 0) throw new Error("Invalid page number");
    if (isNaN(limit) || limit <= 0) throw new Error("Invalid page size");

    const skip = page * limit;
    const filter = {};
    if (searchText) {
      filter.title = { $regex: searchText, $options: "i" };
    }

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).skip(skip).limit(limit).exec(),
      Blog.countDocuments(filter).exec(),
    ]);

    return {
      items: blogs,
      totalCount: totalBlogs,
    };
  } catch (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}

// Get blog by ID
async function getBlogByIdService(Id) {
  try {
    const blog = await Blog.findById(Id);
    if (!blog) {
      throw new NotFoundError("No blog found");
    }
    return blog;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw new Error("Failed to retrieve blog.");
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

// Update blog
async function updateBlogService(data) {
  try {
    const body = {};
    if (data?.title) body.title = data.title;
    if (data?.content) body.content = data.content;
    if (data?.tag) body.tag = data.tag;
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

module.exports = {
  getAllBlogService,
  getBlogByIdService,
  createBlogService,
  updateBlogService,
  deleteBlogService,
};

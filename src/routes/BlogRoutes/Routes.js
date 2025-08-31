const { getAllBlog, addBlog, getBlogById, deleteBlog, createComment, getCommentsByBlogId, deleteComment } = require("@/Controller/Blogs/BlogController")
const express=require("express")
const Router=express.Router()


Router.post("/getAllBlogs",getAllBlog)
Router.post("/createBlog",addBlog)
Router.get("/getBlogsByUser/:id",getBlogById)
Router.delete("/deleteBlog/:id",deleteBlog)
Router.post("/createComment",createComment)
Router.get("/getAllComments/:id",getCommentsByBlogId)
Router.delete("/deleteComment/:id",deleteComment)

module.exports=Router

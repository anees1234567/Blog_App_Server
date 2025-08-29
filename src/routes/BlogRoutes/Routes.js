const { getAllBlog, addBlog, getBlogById, deleteBlog } = require("@/Controller/Blogs/BlogController")
const express=require("express")
const Router=express.Router()


Router.get("/getAllBlogs",getAllBlog)
Router.post("/AddBlog",addBlog)
Router.get("/getBlogById/:id",getBlogById)
Router.delete("/deleteBlog/:id",deleteBlog)

module.exports=Router

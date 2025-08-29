const express=require("express")
const Router=express.Router()
const {getAlluser,createUser,getUserById,deleteUser,loginUser,refreshToken}=require("@controller/user/userController")

Router.get("/getAllUser",getAlluser)
Router.post("/loginUser",loginUser)
Router.get("/refresh",refreshToken)
Router.post("/createUser",createUser)
Router.post("/getUserById/:id",getUserById)
Router.delete("/deleteUser/:id",deleteUser)

module.exports=Router





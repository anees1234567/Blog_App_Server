
const userService=require("@services/UserService/userService")
const {generateToken,refreshTokenHandler}=require("@utility/auth")


async function getAlluser(req,res,next){
   try {
   
      const result=await userService.getAllUsersService()
      res.success(200,result,"details fetched successfully")
   } catch (error) {
     next(error)
   }
}


async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserByIdService(userId);
    res.success(200,user,"user details fetched succesfully")
  } catch (error) {
    next(error); 
  }
}

async function createUser(req,res,next){
    try{    
        if(req.body?.id){
            const result =await userService?.updateUserService(req.body)
            res.success(200,result,"user Updated succesfully")
        }else{
            const result = await userService?.createUserService(req.body)
            res.success(200,result,"User created succsfully")
        }
    }catch(error){
        next(error)
    }
}

async function loginUser(req,res,next){
    try {

        if(!req.body?.email || !req.body?.password){
            throw new Error("email and password required")
        }
        const result=await generateToken(req,res)
        res.success(200,result,"login succesfully")
    } catch (error) {
        next(error)
    }
}

async function refreshToken(req,res,next){
    try {
        const result=await refreshTokenHandler(req,res)
        res.success(200,result,"token refreshed succesfully")
    } catch (error) {
        next(error)
    }
}

async function deleteUser(req,res,next){
    try {
        const userId=req.params.id
        const result=await userService?.deleteUserService(userId)
        res.success(200,result,"deleted succesfully")
    } catch (error) {
        next(error)
    }
}
module.exports={
    getAlluser,
    getUserById,
    createUser,
    deleteUser,
    loginUser,
    refreshToken
}
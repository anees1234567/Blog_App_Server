// services/userService.js
const { NotFoundError } = require("@/utility/errors");
const User = require("@models/UserModel/UserModel"); 

// Get all users
async function getAllUsersService() {
  try {
    const users = await User.find({isDeleted:false}).select('-password');
    return users; 
  } catch (error) {
    throw new Error("Failed to retrieve users."); 
  }
}


async function getUserByIdService(userId) {
  try {
    const user = await User.findById(userId); 
    if (!user) {
        throw new NotFoundError("No user found")
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to retrieve user.");
  }
}


async function createUserService(userData) {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save(); 
    const userObj = savedUser.toObject();
    delete userObj.password;

    return userObj;
  } catch (error) {
    console.error("Error creating user:", error);
    if(error.code==11000){
        throw new Error("Duplicates Entries not allowed.");
    }else{
        throw new Error("Failed to create user.");
    }
  }
}


async function updateUserService(userData) {
  try {
    const body = {};
    if (userData?.name) body.name = userData.name;
    if (userData?.email) body.email = userData.email;
    if (userData?.avatar) body.avatar = userData.avatar;
    if (userData?.bio) body.bio = userData.bio;
    if(userData?.isDeleted) body.isDeleted=userData.isDeleted
   

    const updatedUser = await User.findByIdAndUpdate(userData?.id, body, {
      new: true,           
      runValidators: true,
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found for update.");
    }
   return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error("Failed to update user.");
  }
}



async function deleteUserService(userId) {
  try {
    const deletedUser = await User.findByIdAndDelete(userId); 
    if (!deletedUser) {
        throw new NotFoundError(`User not found for deletion.`); 
    }
    return deletedUser;
  } catch (error) {

    console.error("Error deleting user:", error);
    if(error instanceof NotFoundError){
        throw error
    }else{
        throw new Error("Failed to delete user.");
    }
  }
}

module.exports = {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
};

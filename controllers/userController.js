import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

// Register
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

//Login
export const loginContoller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

//Logout
export const logoutController = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Log out",
    });
  }
};

//Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password").populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

//Update User Controller
export const updateUserController = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const  profilePhoto = req.file;

    if (!name || !profilePhoto) {
      return res.status(500).send({
        message: "All field is required",
        success: false,
      });
    }
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    //if an image already exist, extract publicId of old image from the url
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }

    //upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;
    const updatedData = { name, photoUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).send({
      message: "User Updated Successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Update User Profile",
    });
  }
};

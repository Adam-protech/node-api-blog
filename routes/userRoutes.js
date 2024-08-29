const express = require("express");
const {
  login,
  allUsers,
  SingleUser,
  updateUserCtrl,
  updatePasswordCtrl,
  deleteUserCtrl,
  register,
  profilePhotoUploadCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  blockedUserCtrl,
  unBlockedUserCtrl,
  adminBlockUserCtrl,
} = require("../controllers/userCtrl");
const isLogin = require("../middlewares/isLogin");
const storage = require("../config/cloudinary");
const multer = require("multer");
const isAdmin = require("../middlewares/isAdmin");
const userRouter = express.Router();

//instance of multer
const upload = multer({ storage });

//Register User
userRouter.post("/register", register);

//Login User

userRouter.post("/login", login);

// All users
userRouter.get("/", allUsers);

// Single user
userRouter.get("/profile", isLogin, SingleUser);
//Update user
userRouter.put("/update-user",isLogin, updateUserCtrl);
//Update user password
userRouter.put("/update-password",isLogin, updatePasswordCtrl);
//Delete user
userRouter.delete("/delete-user",isLogin, deleteUserCtrl);
//GET/api/v1/users/profile-viewers/:id
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfileCtrl);
//GET/api/v1/users/following/:id
userRouter.get("/following/:id", isLogin, followingCtrl);
//GET/api/v1/users/following/:id
userRouter.get("/unfollowing/:id", isLogin, unFollowCtrl);
//GET/api/v1/users/block/:id
userRouter.get("/block/:id", isLogin, blockedUserCtrl);
//GET/api/v1/users/unblock/:id
userRouter.get("/unblock/:id", isLogin, unBlockedUserCtrl);

//PUT/api/v1/users/admin-block/:id
userRouter.put("/admin-block/:id", isLogin, isAdmin, adminBlockUserCtrl);

//POST/api/v1/user/profile-photo-upload
userRouter.post(
  "/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  profilePhotoUploadCtrl
);

module.exports = userRouter;

const express = require("express");
const isLogin = require("../middlewares/isLogin");
const { createPostCtrl, 
    fetchPostsCtrl, 
    toggleLikesPostCtrl,
    toggleDislikesPostCtrl,
    postDetailsCtrl,
    deletePost,
    updatePost
 } = require("../controllers/postCtrl");
 const storage = require("../config/cloudinary");
 const multer = require("multer");
const postRouter = express.Router()

//instance of multer
const upload = multer({ storage });

postRouter.post('/',isLogin, createPostCtrl);
postRouter.get('/', isLogin, fetchPostsCtrl);
postRouter.get("/likes/:id", isLogin, toggleLikesPostCtrl);
postRouter.get("/dislikes/:id", isLogin, toggleDislikesPostCtrl);
postRouter.get( "/:id",  isLogin, postDetailsCtrl);
postRouter.delete( "/:id",  isLogin, deletePost);
postRouter.put( "/:id",  isLogin, upload.single("photo"), updatePost);


module.exports = postRouter;
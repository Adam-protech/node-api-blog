const express = require("express");

const isLogin = require("../middlewares/isLogin");
const { createCommentCtrl, AllCommentCtrl, singleComment, deleteComment } = require("../controllers/commentCtrl");

const commentRouter = express.Router();

commentRouter.post("/:id", isLogin, createCommentCtrl);
commentRouter.get("/", AllCommentCtrl);
commentRouter.get("/:id", singleComment);
commentRouter.delete("/:id",isLogin, deleteComment);


module.exports = commentRouter;
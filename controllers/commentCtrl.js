const Comment = require("../model/comment/Comment");
const Post = require("../model/Post/Post");
const User = require("../model/User/User");
const appErr = require("../utils/appErr");

//create comment
const createCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id)
        //create the comment
        const comment= await Comment.create({ post: post._id, description, user: req.userAuth});
        //push the comment 
        post.comments.push(comment._id);
        //find the user
        const user = await User.findById(req.userAuth)
        //push to user list
        user.comments.push(comment._id);
        //save
        await post.save();
        await user.save();
        res.json({
            status: "success",
            data: comment,
        })
    } catch (error) {
        next(appErr(error.message))
    }
};

// all comment

    const AllCommentCtrl = async (req, res, next) => {
        try {
            const comment = await Comment.find();

            res.json({
                status: "success",
                data: comment,
            });
        } catch (error) {
            next(appErr(error.message));
        }
    }

// single comment
const singleComment = async ( req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        res.json({
            status: "success",
            data: comment,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//update comment
const updateComment = async (req,res, next) => {
    const { title } = req.body;
    try{
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: comment,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
   
//delete comment
const deleteComment = async  (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr("you are not allowed to delete this comment", 403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Comment deleted successfully",
        });
    } catch (error) {
        next(appErr(Error.message))
    }
 };

module.exports = {
    createCommentCtrl,
    AllCommentCtrl,
    singleComment,
    updateComment,
    deleteComment,
}
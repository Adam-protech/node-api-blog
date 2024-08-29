const Post = require("../model/Post/Post");
const User = require("../model/User/User");
const appErr = require("../utils/appErr");

//create
const createPostCtrl = async (req, res) => {
    const {title, description,category} = req.body;
    try{
        //find the user
        const author = await User.findById(req.userAuth);
        //check if the user is blocked
        if (author.isBlocked) {
            return next(appErr("Access denied, account blocked", 403));
        }
        //check if the title is already taken
        const postTitle = await Post.findOne({ title})
        if (postTitle){
            return next(appErr(`${title} already exists`,403));
        }
        //create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: author._id
        });
        //Associate user to a post  -push the post into posts
        author.posts.push(postCreated._id);
        await author.save();
        res.json({
            status: "success",
            data: postCreated,
        });z
    } catch (error) {
        res.json(error.message);
    }
};

//All
const fetchPostsCtrl = async (req, res,next) => {
    try {
        const posts = await Post.find({})
        .populate("user")
        .populate("category","title")

        //check if the user is blocked by the post owner
        const filteredPosts = posts.filter(post => {
            //get all blocked users
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);

            return !isBlocked
        });
        res.json({
            status: "success",
            data: filteredPosts,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//togglelike
const toggleLikesPostCtrl = async (req, res, next) => {
   try {
     //Get the post you want to like
     const post = await Post.findById(req.params.id);
     //check if the user already dislike the post
     const isDisLiked = post.disLikes.includes(req.userAuth);
    //  //check if the user like the post
     const isLiked = post.likes.includes(req.userAuth);

     if (isDisLiked) {
        return next(
            appErr("you have already dislikes the post,undislike to like the post")
        );
     } else {
        // to unlike the post
        if(isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString())
            await post.save();
        }else{
            //if the user has not like the post, like the post
            post.likes.push(req.userAuth)
            await post.save()
        }
        res.json({
            status: "success",
            data: post,
        });
    }
    res.json({
        status: "success",
        data: post
    })
   } catch (error) {
    next(error.message)
   }
};
//TOGGLEdislike
const toggleDislikesPostCtrl = async (req, res, next) => {
    try {
      //Get the post you want to dislike
      const post = await Post.findById(req.params.id);
      //check if the user dislike the post
      const isDisliked = post.disLikes.includes(req.userAuth);
      // to unlike the post
      if(isDisliked) {
          post.disLikes = post.disLikes.filter(
            (dislike) => dislike.toString() !== req.userAuth.toString()
          );
          await post.save();
      }else{
          //if the user has not like the post, like the post
          post.disLikes.push(req.userAuth);
          await post.save();
      }
      res.json({
         status: "success",
         data: post
      })
    } catch (error) {
     next(error.message)
    }
 };

 //post details
 const postDetailsCtrl = async (req, res, next) => {
    try {
        //find the post 
        const post = await Post.findById(req.params.id);
        //number of view
        //check if the user viewed this post
        const isViewed = await post.numViews.includes(req.userAuth)
        if (isViewed) {
            res.json({
                status: "success",
                data: post,
            })
        }else{
            //push into numViews
            post.numViews.push(req.userAuth)
            await post.save()
            res.json({
                status: "success",
                data: post,
            })
        }
    } catch (error) {
        next(appErr(error.message));
    }
 } ;

 //delete post
 const deletePost = async  (req, res, next) => {
    try {
        //find post to delete
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("you are not allowed to delete this post", 403));
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Post deleted successfully",
        });
    } catch (error) {
        next(appErr(Error.message))
    }
 };

//update post
const updatePost = async (req,res, next) => {
    const { title, description, category } = req.body;
    try{
        //find the post
        const post = await Post.findById(req.params.id)
        if(post.user.toString() !== req.userAuth.toString()){
            return next(appErr("you are not allowed to update this post",403))
        }

        const updatePost = await Post.findByIdAndUpdate(req.params.id,
            { title, description, category, photo: req?.file?.path },
            { new: true }
        );
        res.json({
            status: "success",
            data: updatePost,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
            
    

 
 

module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    toggleLikesPostCtrl,
    toggleDislikesPostCtrl,
    postDetailsCtrl,
    deletePost,
    updatePost,
};
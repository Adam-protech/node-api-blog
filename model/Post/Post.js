const mongoose = require("mongoose");
const User = require("../User/User");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
  
    },
    numViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required"],
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

postSchema.pre(/^find/, function(next) {
  //add view counts as virtual field
  postSchema.virtual("viewsCount").get(function() {
    const post = this;
    return post.numViews.length;
  });
  postSchema.virtual("likesCount").get(function() {
    const post = this;
    return post.likes.length;
  });
  postSchema.virtual("disLikesCount").get(function() {
    const post = this;
    return post.disLikes.length;
  });
  //check the most like post in percentage
  postSchema.virtual("likePercentage").get(function() {
    const post = this;
    const total = +post.likes.length + +post.disLikes.length
    const percentage = Math.floor((post.likes.length / total) *100);
    return `${percentage}%`;
  });
  //check the most dislike post in percentage
  postSchema.virtual("dislikePercentage").get(function() {
    const post = this;
    const total = +post.likes.length + +post.disLikes.length
    const percentage = Math.floor((post.disLikes.length / total) *100);
    return `${percentage}%`;
  });
  //if day is less than 0 return today, if day is 1 return yesterday else return days ago
  postSchema.virtual("daysAgo").get(function() {
    const post = this;
    const date = new Date(post.createdAt);
    const daysAgo = Math.floor((Date.now() - date) / 86400000);
    return daysAgo === 0
    ? "Today"
    : daysAgo === 1
    ? "Yesterday"
    : `${daysAgo} days ago`;
  });


  next();
});
  

  


//compile the user model
const Post = mongoose.model("Post", postSchema);


module.exports = Post;

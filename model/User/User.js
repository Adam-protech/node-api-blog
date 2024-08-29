const mongoose = require("mongoose");
const Post = require("../Post/Post");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Editor"],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: String,
      enum: ["Free", "Premium", "Pro"],
      default: "Free",
    },

    userAward: {
      type: String,
      enum: ["Bronze", "Sliver", "Gold"],
      default: "Bronze",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.pre("findOne", async function (next) {
  //get the user id
  const userId = this._conditions._id;
  //find the post created by the user
  const posts = await Post.find({ user: userId });
  //GET the last post created by the user
  const lastPost = posts[posts.length - 1];

  //get the last post date
  const lastPostDate = new Date(lastPost?.createdAt);
  //get the last post date in string format
  const lastPostDateStr = lastPostDate.toDateString();
  //add virtual to the schema
  userSchema.virtual("lastPostDate").get(function () {
    return lastPostDateStr;
  });
 //check if user is inactive for 30days
    //get current date
    const currentDate = new Date();
    //get the difference between last post date and the current date
    const diff = currentDate -lastPostDate;
    //get the difference between in days and return less than in days
    const diffInDays = diff / (1000 * 3600 * 24);

    if (diffInDays > 30) {
      //add virtuals isinactive to the schema to check if a user is inactive for 30days
      userSchema.virtual("isInactive").get(function () {
        return true;
      });
      //find the user by ID and update
      await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );
    } else {
      userSchema.virtual("isInactive").get(function () {
        return false;
      });
      //find the user by id and update
      await User.findByIdAndUpdate(
        userId,
        {
          isBlocked: false,
        },
        {
          new:true,
        }
      );
    }
    //-----------last active date-----------
    //convert to days ago, for example 1 day ago
    const daysAgo = Math.floor(diffInDays);
    //add virtuals lastActive in days to the schema
    userSchema.virtual("lastActive").get(function () {
      //check if daysago is less than 0
      if (daysAgo <= 0) {
        return "Today";
      }
      //check if daysago is equal to 1
      if (daysAgo === 1) {
        return "Yesterday";
      }
      //check if days ago is greater than 1
      if (daysAgo > 1) {
        return `${daysAgo} days ago`;
      }
    });

    //update useraward based on the number of posts
//get the number of posts
const numberOfPosts = posts.length;
//check if the number of post is less than 10
if (numberOfPosts < 10) {
  await User.findByIdAndUpdate(
    userId,
    {
      userAward: "Bronze",
    },
    {
      new: true,
    }
  );
}
//check if the number of posts is greter than 10
if (numberOfPosts > 10) {
  await User.findByIdAndUpdate(
    userId,
    {
      userAward: "silver",
    },
    {
      new: true,
    }
  );
}
//check if the number of posts is greter than 20
if (numberOfPosts > 20) {
  await User.findByIdAndUpdate(
    userId,
    {
      userAward: "Gold",
    },
    {
      new: true,
    }
  );
}
  next();
});

// //Add fullname
userSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
//add initials
userSchema.virtual("initials").get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`;
});
//add postCount
userSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

//compile the user model
const User = mongoose.model("User", userSchema);

module.exports = User;

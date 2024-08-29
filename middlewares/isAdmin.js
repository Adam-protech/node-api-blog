const User = require("../model/User/User");
const appErr = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
  //get token from headers
  const token = getTokenFromHeader(req);
  //verify token
  const decodedUser = verifyToken(token);
  //save the user into req obj
  req.userAuth = decodedUser.id;
  //find the user in DB
  const user = await User.findById(decodedUser.id);
  //check if the user is admin
  if (user.isAdmin) {
    return next();
  } else {
    return next(appErr("Access Denied, Admin Only", 404));
  }
};

module.exports = isAdmin;

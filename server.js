const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");

const globalErrHandler = require("./middlewares/globalErrHandler");
const postRouter = require("./routes/postRoutes");
const categoryRouter = require("./routes/categoryRoute");
const comment = require("./routes/commentRoute");
dotenv.config();
require("./config/dbConnect");
const app = express();

//middleware
app.use(express.json());

//routes
//---User---
app.use("/api/v1/user", userRouter);
//---Post---
app.use("/api/v1/posts",postRouter);
//---Category---
app.use("/api/v1/category",categoryRouter);
//----comment------
app.use("/api/v1/comment",comment);

//Error handlers middleware
app.use(globalErrHandler);

//404 error
app.use("*", (req, res) => {
  res.status(404).json({
    message: `${req.originalUrl} - Route not found`,
  });
});
//Listen to server

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server is up running on ${PORT}`));

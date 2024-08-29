const express = require("express");

const isLogin = require("../middlewares/isLogin");
const { createCategoryCtrl, fetchCategoryCtrl, fetchSingleCategory, updateCategory, deleteCategory } = require("../controllers/categoryCtrl");

const categoryRouter = express.Router();

categoryRouter.post("/", isLogin, createCategoryCtrl);
categoryRouter.get("/", fetchCategoryCtrl);
categoryRouter.get("/:id", fetchSingleCategory);
categoryRouter.put("/:id",isLogin, updateCategory);
categoryRouter.delete("/:id",isLogin, deleteCategory);

module.exports = categoryRouter;
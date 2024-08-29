const Category = require("../model/category/Category");
const appErr = require("../utils/appErr");


//create category
const createCategoryCtrl = async (req, res, next) => {
    const { title } = req.body;
    try {
        const category= await Category.create ({ title, user: req.userAuth});
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};
//fetch all categories

    const fetchCategoryCtrl = async (req, res, next) => {
        try {
            const categoories = await Category.find();

            res.json({
                status: "success",
                data: categoories,
            });
        } catch (error) {
            next(appErr(error.message));
        }
    }

//fetch single category
const fetchSingleCategory = async ( req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//update category
const updateCategory = async (req,res, next) => {
    const { title } = req.body;
    try{
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: category,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//delete category
const deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            message:"Category deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message))
    }
}

module.exports = {
    createCategoryCtrl,
    fetchCategoryCtrl,
    fetchSingleCategory,
    updateCategory,
    deleteCategory,
}

const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category don't exist"
            });
        }
        req.category = category;
        next();
    });
};
exports.read = (req, res) => {
    return res.json(req.category);
};

exports.remove = (req, res) => {
    const category =req.category;
    category.remove((err,deleteCategory)=>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        } 
        res.json({
            deleteCategory,
            message:"Category delete successfully"
        });
    });
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

        category.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(                
                {message:"update category success"}
            );
        });
   
};

exports.list = (req, res) => {
    Category.find().exec((err,result)=>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(
            result
        );
    });
};
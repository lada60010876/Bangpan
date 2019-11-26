const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .populate("ownername")
    .exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found id"
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

//ลบสินค้า
exports.remove = (req, res) => {
    let product =req.product;
    product.remove((err,deleteProduct)=>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        } 
        res.json({
            deleteProduct,
            message:"product delete successfully"
        });
    });
};

//สร้างสินค้า
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        let product = new Product(fields);
        const {
            name,
            description,
            category,
            ownername,

        } = fields;
        if(!name){
            return res.status(400).json({
                error: "Name field require"
            });
        }
        if(!description){
            return res.status(400).json({
                error: "Dscription field require"
            });
        }
        if(!ownername){
            return res.status(400).json({
                error: "ownername "
            });
        }


        if (files.photo) {
            //console.log('FILE PHOTO',files.photo);
            if(files.photo.size>5000000){
                //5mb=5,000,000
                return res.status(400).json({
                    error: "Image size sould  be less than 5mb"
            });
        }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

//แก้ไขรายละเอียดสินค้า
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {
            name,
            description,
            category
        } = fields;
        if(!name||!description||!category){
            return res.status(400).json({
                error: "All field require"
            });
        }
        let product = req.product;
        product =_.extend(product,fields);
        

        if (files.photo) {
            //console.log('FILE PHOTO',files.photo);
            if(files.photo.size>5000000){
                //5mb=5,000,000
                return res.status(400).json({
                    error: "Image size sould  be less than 5mb"
            });
        }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

// sort by sell = /product?sortBy=status&order=asc&limit=6
// sort by arrive = /product?sortBy=ceatedAt&order=asc&limit=6
//if no param sent then all product is sent

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product.find({})
        .select("-photo")
        .populate("category")
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found "
                });
            }
            res.json(products);
        });
};



exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "asc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

                findArgs[key] = req.body.filters[key];
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    };
    next();
};
exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
};

exports.changStatusProduct = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { status: item.status+2} }
            }
        };
    });
    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};
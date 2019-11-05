const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
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
            category
        } = fields;
        if(!name||!description||!category){
            return res.status(400).json({
                error: "All field require"
            });
        }
        if (files.photo) {
            //console.log('FILE PHOTO',files.photo);
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        if(files.photo.size>5000000){
            //5mb=5,000,000
            return res.status(400).json({
                error: "Image size sould  be less than 5mb"
            });
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

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let product = req.product;
        const {
            name,
            description,
            category
        } = fields;
        product =_.extend(product,fields);
        
        if(!name||!description||!category){
            return res.status(400).json({
                error: "All field require"
            });
        }
        if (files.photo) {
            //console.log('FILE PHOTO',files.photo);
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        if(files.photo.size>5000000){
            //5mb=5,000,000
            return res.status(400).json({
                error: "Image size sould  be less than 5mb"
            });
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
const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};
exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name category ownername  phone")
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};


exports.listOrders = (req, res) => {
    console.log('List Order buyer',req.profile._id);
    Order.find({ user: req.profile._id })
        .populate("user", "_id firstname lastname address phone")
        .populate("ownername", "_id username firstname lastname address phone")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.listOrdersSell = (req, res) => {
    console.log('List Order Seller',req.body.order.products[0].ownername._id);
    Order.find({ user: req.body.order.products[0].ownername._id})
        .populate("user", "_id firstname lastname address phone")
        .populate("ownername", "_id username firstname lastname address phone")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        }
    );
};
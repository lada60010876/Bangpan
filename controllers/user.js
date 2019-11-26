const User = require("../models/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
};



exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};


exports.update = (req, res) => {
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true},
        (err,user)=>{
            if (err ) {
                return res.status(400).json({
                    error: "accesss denied"
                });
            }
            user.hashed_password = undefined; 
            user.salt =undefined; 
        }
        )
};

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];
    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            ownername:item.ownername
        });
    });
    // to buyer
    console.log('Create Order buyer',req.profile._id);
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
            next();
        }                                                                                                                                         
    );
 };

 exports.addOrderToSellerHistory = (req, res, next) => {
    let history = [];
    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            ownername:item.ownername
        });
    });

    //to seller
    console.log('Create Order seller',req.body.order.products[0].ownername);
    User.findOneAndUpdate(
        { _id:req.body.order.products[0].ownername.toString()},
        { $push: { history: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
            next();
        }
    )
 };




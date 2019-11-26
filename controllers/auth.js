const User = require("../models/user");
const jwt =require('jsonwebtoken');
const expressJwt=require('express-jwt');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json(user);

    });
};

exports.signin = (req, res) => {
    // find the user based on email or username
    const { username,email, password } = req.body;
    const criteria = {$or: [{username: username}, {email: username}]};
    User.findOne(criteria, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "username or email is not exist"
            });
        }
        // if user is found make sure the email/username  and password match
        // create authenticate method in user model
        if (!user.authenticate(password) ) {
            return res.status(401).json({
                error: "username and password dont match"
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, username, email,firstname,lastname,address,phone, role } = user;
        return res.json({ token, user: { _id, email, username,firstname,lastname,address,phone, role } });
    });

};
exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({message:"sign out succeed"});
};
exports.reqSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
});
exports.isAuth=(req,res,next)=>{
    let user =req.profile &&req.auth && req.profile._id ==req.auth._id
    if (!user){
        return status(403).json({
            error :"access denied"
        });
    }
    next();
};
exports.isAdmin=(req,res,next)=>{
    if (req.profile.role===0){
        return status(403).json({
            error :"only admin! access denied"
        });
    } 
    next();
};
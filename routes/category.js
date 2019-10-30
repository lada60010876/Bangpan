const express = require("express");
const router = express.Router();
const { 
    reqSignin ,
    isAuth,
    isAdmin
} = require("../controllers/auth");
const { create } = require("../controllers/category");
const { userById } = require("../controllers/user");

router.post(
    "/category/create/:userId", 
    reqSignin ,
    isAuth,
    create
    );
router.param("userId", userById);
module.exports = router;


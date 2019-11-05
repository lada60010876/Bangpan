const express = require("express");
const router = express.Router();
const { 
    reqSignin ,
    isAuth,
    isAdmin
} = require("../controllers/auth");
const { create ,categoryById,read,remove,update} = require("../controllers/category");
const { userById } = require("../controllers/user");

router.post(
    "/category/create/:userId", 
    reqSignin ,
    isAuth,
    create
    );
router.get("/category/:categoryId", read);
router.put(
    "/category/:categoryId/:userId", 
    reqSignin ,
    isAuth,
    create
    );
router.delete(
    "/category/:categoryId/:userId",
    reqSignin, 
    isAuth,
    isAdmin,   
    remove
    );
router.put("/category/:categoryId/:userId",reqSignin, isAuth,update);
router.param("categoryId", categoryById);
router.param("userId", userById);
module.exports = router;


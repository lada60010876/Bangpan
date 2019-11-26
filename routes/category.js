const express = require("express");
const router = express.Router();
const { 
    reqSignin ,
    isAuth,
    isAdmin
} = require("../controllers/auth");
const { create ,categoryById,read,remove,update,list} = require("../controllers/category");
const { userById } = require("../controllers/user");

// create
router.post(
    "/category/create/:userId", 
    reqSignin ,
    isAuth,
    create
    );
    
// show list all  category
router.get("/categories", list);

//show category 
router.get("/category/:categoryId", read);

// router.post(
//     "/category/:categoryId/:userId", 
//     reqSignin ,
//     isAuth,
//     create
//     );

// only admin can delete category 
router.delete(
    "/category/:categoryId/:userId",
    reqSignin, 
    isAuth,
    isAdmin,   
    remove
    );

//  only admin update category 
router.put("/category/:categoryId/:userId",reqSignin, isAuth,update);


router.param("categoryId", categoryById);
router.param("userId", userById);
module.exports = router;


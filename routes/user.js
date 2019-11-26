const express = require("express");
const router = express.Router();

const { reqSignin,isAuth,isAdmin } = require("../controllers/auth");

const { userById,read,update } = require("../controllers/user");
//แอดมินดูไอดีคนอื่น
router.get(
    "/secret/:userId", 
    reqSignin,
    //isAuth,
    //isAdmin,
    (req, res) => {
    res.json({
        user: req.profile
    });
});
//ดูข้อมูลuser
router.get(
    "/user/:userId", 
    reqSignin,
    isAuth,
    read
);
//แก้ไขข้อมูลuser
router.put(
    "/user/:userId", 
    reqSignin,
    isAuth,
    update
);

//ออร์เดอร์
router.get("/orders/by/user/:userId", 
    reqSignin, 
    isAuth, 
    // purchaseHistory
    );

router.param("userId", userById);

module.exports = router;
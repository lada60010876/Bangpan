const express = require("express");
const router = express.Router();

const { 
    signup, 
    signin, 
    signout,
    reqSignin 
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/testReqSigin", reqSignin,(req,res)=>{
    res.send("testReqSigin");
});

module.exports = router;
const express = require("express");
const router = express.Router();

const { create, productById, read,remove,update } = require("../controllers/product");
const { reqSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/product/:productId", read);
router.post("/product/create/:userId", reqSignin, isAuth, create);
router.delete("/product/:productId/:userId",reqSignin, isAuth,remove);
router.put("/product/:productId/:userId",reqSignin, isAuth,update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
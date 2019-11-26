const express = require("express");
const router = express.Router();

const { reqSignin, 
    isAuth 
} = require("../controllers/auth");
const { userById,
    addOrderToUserHistory,
    addOrderToSellerHistory 
} = require("../controllers/user");
const { create,listOrders,
    listOrdersSell,
    getStatusValues,
    updateOrderStatus,
    orderById, 
} = require("../controllers/order");
const { changStatusProduct 
} = require("../controllers/product");

router.post("/order/create/:userId", 
    reqSignin, 
    isAuth,
    addOrderToUserHistory,
    addOrderToSellerHistory,
    changStatusProduct,
    create
);

router.get("/order/list/:userId", 
    reqSignin, 
    isAuth,
    listOrders,
    listOrdersSell
);

router.get(
    "/order/status-values/:userId",
    reqSignin, 
    isAuth,
    getStatusValues,
    
);
router.put(
    "/order/:orderId/status/:userId",
    reqSignin,
    isAuth,
    updateOrderStatus,
    changStatusProduct
);
router.param("userId", userById);
router.param("orderId", orderById);
module.exports = router;
const express = require("express");
const router = express.Router();
const { 
    create, 
    productById, 
    read,
    remove,
    update,
    list,
    listCategories,
    listSearch,
    listBySearch,
    photo
} = require("../controllers/product");
const { 
    reqSignin, 
    isAuth, 
    isAdmin 
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
//อ่านข้อมูลสินค้า
router.get(
    "/product/:productId", 
    read
    );
//สร้างสินค้า
router.post(
    "/product/create/:userId", 
    reqSignin, 
    isAuth, 
    create
    );
//ลบสินค้า    
router.delete(
    "/product/:productId/:userId",
    reqSignin, 
    isAuth,
    remove
    );
//แก้ไขสินค้า
router.put(
    "/product/:productId/:userId",
    reqSignin, 
    isAuth,
    update
    );
//แสดงสินค้าทั้งหมด    
router.get(
    "/products", 
    list
    );

//แสดงลิสสินค้าแบบเลือกcategory
 router.get(
         "/products/categories", 
         listCategories
        );
//แสดงสินค้าที่ผ่านการค้นหา
router.post(
    "/products/by/search", 
    listBySearch
    );
router.get(
        "/products/search", 
        listSearch);
        
//รูป
router.get(
    "/products/photo/:productId",
     photo
     );

     
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
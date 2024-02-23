const express=require('express')
const {registerUser , authUser , allUsers}=require("../controller/userControllers");
const router=express.Router()
const {protect}=require("../Middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login', authUser)


module.exports=router;
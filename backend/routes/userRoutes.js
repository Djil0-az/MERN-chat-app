// all user related routes go here 
const express = require('express');
const {signupUser,authUser, allUsers} = require("../controllers/userControllers");
const { authorise } = require('../middleware/authMiddleware');

const router = express.Router();
// router.route('/').post(signupUser).get(authorise,allUsers);
// router.post('/login', authUser);

router.route("/").get(authorise, allUsers);
router.route("/").post(signupUser);
router.post("/login", authUser);

module.exports = router;



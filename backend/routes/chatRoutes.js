const express = require('express');
const { accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup } = require('../controllers/chatControllers');
const { authorise } = require('../middleware/authMiddleware');

const router = express.Router();

//if user is not logged in, they cannot access this route
router.route('/').post(authorise,accessChat);//enter chat
router.route('/').get(authorise,fetchChats);// fetch user chats from db
router.route('/makegroup').post(authorise,createGroupChat);// create a group chat
router.route('/rename').put(authorise,renameGroup);// rename the group
router.route('/remove').put(authorise,removeFromGroup);// remove a user from the group
router.route('/add').put(authorise,addToGroup);// add a new member to the group

module.exports = router;
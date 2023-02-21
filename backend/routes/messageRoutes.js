const express = require("express");
const {allMessages,sendMessage,} = require("../controllers/messageControllers");

const { authorise } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(authorise, allMessages);
router.route("/").post(authorise, sendMessage);

module.exports = router;
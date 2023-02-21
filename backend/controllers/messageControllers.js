const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const Message = require('../Models/MessageModel');
const User = require('../Models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
     // if content or chat ID doesn't exist return an error
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  //populate instance of mongoose class 
    // chat,sender and user
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    // find by id and update the chat with latest message

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// get all messages from chat 
const allMessages = asyncHandler(async (req,res)=>{
    try { // populate sender with req params and then populate the chat
        const messages = await Message.find({chat: req.params.chatId})
            .populate("sender","name email pic")
            .populate("chat");

        res.json(messages);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
});

module.exports = {sendMessage,allMessages}






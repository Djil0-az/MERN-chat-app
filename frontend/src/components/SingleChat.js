import React from 'react';
import { useEffect, useState } from "react";
import { ChatState } from '../contextAPI/chatProvider';
import {getSender, getSenderFull} from '../config/ChatLogics'
import ProfileModal from '../components/extra/ProfileModal';
import {Box,Text} from '@chakra-ui/layout';
import { FormControl, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import {ArrowBackIcon} from '@chakra-ui/icons'
import UpdateGroupChatModal from './extra/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie-player';
import animationData from '../animations/typing.json';
// this class handles the UI for single chat but also communicates with the backend and contains the socket client

// create end point for our sockets this can be changed when deployed
const ENDPOINT = "http://127.0.0.1:5566"; // use another end point after deployment
var socket,selectedChatCompare;



const SingleChat = ({fetchAgain,setFetchAgain}) => {
  // selecet a user to start a chat with 
  const {selectedChat, setSelectedChat, user, notification, setNotification }= ChatState();
  //  for all messages 
  const [messages,setMessages]= useState([]);
  const [loading,setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  // socket connection state
  const [socketConnect, setSocketConnect] = useState(false);
  // typing states 
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  //toast
  const toast = useToast();

  // Animation Options
   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log('authorised now loading');
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("set messages.....");
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
    }
  };

  //send message
  const sendMessage = async (event)=>{
    if(event.key==="Enter" && newMessage){
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization : `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
    const { data } = await axios.post("/api/message",{
      content: newMessage,
      chatId: selectedChat._id,
    },config
    );
    //send message to socket
    // 
      socket.emit('new message', data);
       console.log("new message socket emitted");
       console.log(data); 
    
    
    // append to allMessages array 
    setMessages([...messages, data]);
    console.log(messages);

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  
 
 // useEffect for websockets
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnect(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  //  fetch chats whenever a user selects a chat 
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // send notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        console.log(`newMessageRecieved: ${newMessageRecieved}`);
        
      }
    });
  });

  //show user is typing 
  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
    // Indicate user is typing 
    if(!socketConnect) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    // after sometime the user is not typing anymore use a timer to compare 
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    }

  

  return (
    <>
    {/* check if user selected a chat then display else show a screen that asks user to select a chat */}
     {selectedChat ? (
      // show single chat here
     <>
     <Text
        fontSize={{ base: "1.75rem", md: "2rem" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        d="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
     >
      <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon/>}
              onClick={() => setSelectedChat("")}
            />
            {/* check if  chat is not a groupChat */}
            { !selectedChat.isGroupChat?
            // is not a group chat display name and profile modal
                (<>
                {getSender(user,selectedChat.users)}
                <ProfileModal user = {getSenderFull(user,selectedChat.users)}/>
                </>):
            // is a group chat
            (<>{selectedChat.chatName.toUpperCase()}
            {/* update the groupChat modal using the fetchAgain */}
            {
              <UpdateGroupChatModal
              fetchAgain = {fetchAgain}
              setFetchAgain= {setFetchAgain}
              fetchMessages = {fetchMessages} />
            }
            </>
            )}
     </Text>
     <Box
     d= 'flex'
     flexDir='column'
     justifyContent = 'flex-end'
     p={3}
     bg = '#e8e8e8'
     w='100%'
     h='100%'
     borderRadius='lg'
     overflowY = 'hidden'>
            {/* inset messages here  */}
            {loading?
            (<Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf = 'center'
                margin = 'auto'
            />
            ):( 
            // messages
            <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              }}>
              <ScrollableChat messages = {messages}/>
            </div>)}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
               {isTyping ?
                <div>
                <Lottie
                // animation data
                  loop
                  animationData={animationData}
                    width={7}
                    play
                    style={{ 
                      marginBottom: 15,
                      marginLeft: 0,
                      width: 70,
                      height: 50 }}
                    />
               </div>:<></>}
               <Input
                  variant= 'filled'
                  bg ="#E0E0E0"
                  placeholder= 'Enter a message....'
                  onChange={typingHandler}
                  value = {newMessage}/>
            </FormControl>
     </Box>
     </>):(// display suggestion
      
     <Box d='felx' alignitems = 'center' justifyContent ='center' h='100%'
     >
      <Text fontSize= '3xl' pb={3} fontFamily = "sans-serif"> Select a user to start chatting... </Text>
     </Box>)} 
    </>
  );
};


export default SingleChat;

import React, { useState} from 'react'
import { ChatState } from '../contextAPI/chatProvider'
import SideDrawer from '../components/extra/sideDrawer'
import MyChats from '../components/extra/myChats'
import ChatBox from '../components/ChatBox'
import { Box } from '@chakra-ui/react'

const ChatScreen = () => {
const {user} = ChatState(); //fetch state from context api
// fetchAgain fetches all the chats once again providing updates 
const [fetchAgain,setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box
      display="flex" 
      justifyContent="space-between" 
      w="100%" 
      h="91.5vh" 
      p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatScreen;









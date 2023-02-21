import {createContext, useState, useEffect,useContext} from 'react'
import { useHistory } from 'react-router-dom';
// state management for chat 

const chatContext = createContext();

const ChatProivder = ({children})=>{
    const [user, setUser] = useState(); // make this state accesable for the entire app
    const [chats,setChats] =useState();
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([]);

    const history = useHistory();
    // fetch user info from storage and parse it
    useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

    return(
        <chatContext.Provider value ={{ 
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            notification,
            setNotification,
            chats,
            setChats,}}>
            {children}
        </chatContext.Provider>
    )
};
export const ChatState = ()=>{
    return useContext(chatContext);
}

export default ChatProivder;
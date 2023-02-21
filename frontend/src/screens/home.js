import React from 'react'
import {Container,Box,Text,Tab,Tabs,TabList,TabPanels,TabPanel} from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useEffect } from "react";
import { useHistory } from "react-router"
//Home page will show our login/signup forms
const Home = () => {
  //if user is logged in push him to chats 
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    
    if (user) history.push("/chat");
  }, [history]);
  
  return (
    <Container maxW='xl' centerContent>
        {/* app title container box */}
        <Box
        display='flex'
        justifyContent='center'
        p={3}
        bg={"ivory"}
        w="100%"
        m="2rem 0 1rem"
        borderRadius="lg"
        borderWidth ='0.05rem'
        >
        {/* Header text  */}
        <Text fontSize='3xl'
         fontFamily = 'Nunito'
          textAlign='center'
          >
            Tap-Tap Chat
            </Text>
        {/* Signup Login Form */}
        
        </Box>
        <Box
        bg= 'ivory' 
        w='100%'
        p={4}
        borderRadius = "lg"
        borderWidth ='0.05rem'>
        <Tabs variant='soft-rounded' colorScheme='teal'>
        <TabList mb='1rem'>
            <Tab width= '50%'>Login</Tab>
            <Tab width= '50%'>Signup</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
            {/* Login */}
            <Login/>
            </TabPanel>
            <TabPanel>
            {/* Signup */}
            <Signup/>
            </TabPanel>
        </TabPanels>
        </Tabs>
            
        </Box>
    </Container>
  )
}

export default Home

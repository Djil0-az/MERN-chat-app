import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ChatProivder from './contextAPI/chatProvider';


ReactDOM.render(
  <BrowserRouter>
   <ChatProivder>
    <ChakraProvider>
        <App />
  </ChakraProvider>
   </ChatProivder>
  </BrowserRouter>,



  document.getElementById("root")
);


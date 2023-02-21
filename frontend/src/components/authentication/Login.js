import React, {useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Login = () => {
   //user credentials for login
    const [show, setShow] = useState(false); //dont show password by default
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [load,setLoading]=useState();
    const toast = useToast();
    const history = useHistory();
    
    //handler functions 
    const handleclick = ()=> setShow(!show);

    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // post data to DB using API 
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing = '0.25rem' >
      <FormControl id= "email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder='Enter your email'
            value = {email}
            //manage change in state using event
             onChange={(e)=>setEmail(e.target.value)}
            />
      </FormControl>

      <FormControl id= "password" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
        <Input
            type={show? "text": "password"}
            placeholder='Enter your password'
            value ={ password}

            //manage change in state using event
            //hide password by default then show on button toggle 
             onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width= '4.5rem'>
                <Button
                h='1.75rem'
                size= 'sm'
                onClick ={handleclick}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
      colorScheme="teal"
      width="100%"
      style = {{marginTop : 15}}
      onClick = {submitHandler}
      isLoading={load}>
        Login
      </Button>

     <Button
        variant="solid"
        colorScheme="yellow"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Login as a Guest User
      </Button>
    </VStack>
  );
}

export default Login

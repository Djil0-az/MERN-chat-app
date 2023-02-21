import { Button, FormControl, FormLabel, Input, InputGroup,useToast, InputRightElement, VStack } from '@chakra-ui/react'
import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Signup = () => {
    //user credentials for signup
    const [show, setShow] = useState(false); //dont show password by default
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading,setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    //handler functions 
    const handleclick = ()=> setShow(!show);//hide or show password
   
    // verify email using regex 
    const validateEmail = (email) => {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(String(email).toLowerCase());
}

    const postPic = (pics)=>{
    setLoading(true);
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file",pics);
        data.append("upload_preset","Tap-Tap Chat");
        data.append("cloud_name","djilo");
        fetch("https://api.cloudinary.com/v1_1/djilo/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {// if image is not uploaded 
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
 
    const submitHandler = async (event)=>{
      setLoading(true);

      // check if fields are not empty
    if (!name || !email || !password || !confirmPassword) {
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
    // check if email matches regex
    event.preventDefault();
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
    toast({
        title: "Please enter valid Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
  }
    // check if passwords are matching
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    
    // make API request to store in database
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      
      const { data } = await  axios.post(
        "/api/user",
        {name,email,password,pic,},
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(name, email, password, pic);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      // route to chat page if successful 
      history.push("/chat");
    
      // error handling
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

      <FormControl id= "first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
            placeholder='Enter your name'
            //manage change in state using event
             onChange={(e)=>setName(e.target.value)}
            />
      </FormControl>

      <FormControl id= "email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder='Enter your email'
            //manage change in state using event
             onChange={(e)=>setEmail(e.target.value)}
            />
      </FormControl>

      <FormControl id= "password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
            type={show? "text": "password"}
            placeholder='Confirm your password'
            //manage change in state using event
            //hide password by default then show on button toggle 
             onChange={(e)=>setConfirmPassword(e.target.value)}
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

      <FormControl id= "password" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
        <Input
            type={show? "text": "password"}
            placeholder='Enter your password'
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

       <FormControl id= "pic">
        <FormLabel>Upload a profile picture</FormLabel>
        <Input
            type = "file"
            p = {1.5}
            accept = "image/*"
            //manage change in state using event
             onChange={(e)=>postPic(e.target.files[0])}
            />
      </FormControl>
      <Button
      colorScheme="teal"
      width="100%"
      style = {{marginTop : 15}}
      onClick = {submitHandler}
      isLoading = {loading}>
        Submit
      </Button>
    </VStack>
  );
};

export default Signup
// https://api.cloudinary.com/v1_1/djilo/image/upload
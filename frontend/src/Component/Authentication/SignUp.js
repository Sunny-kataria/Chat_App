import { Button, FormControl,Input, FormLabel, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import {useHistory} from 'react-router-dom'

const SignUp = () => {

    const [show , setShow]=useState(false)
    const[name , setName]=useState();
    const[email , setEmail]=useState()
    const[password , setPassword]=useState()
    const[confirmpassword , setconfirmpassword]=useState()
    const[pic, setpic]=useState()
    const [loading,setLoading]=useState(false);   
    const toast=useToast();
    const history=useHistory();
    const handleClick=()=>{
        setShow(!show)
    }
    const postDetails=(pics)=>{
//to be continued for uploading and storing pitcure in cludinary

    //  setLoading(true);
    //  if(pic===undefined){
    //     toast({
    //         title: 'Please Select an Image',
    //         status: 'Warning',
    //         duration: 5000,
    //         isClosable: true,
    //         position:"bottom"
    //       })
    //       return;
    //  }
    //   if(pics.type === "image/jpeg" || pics.type === "image/png");

    };
    const submitHandler=async()=>{
        setLoading(true);
        if(!name||!email||!password||!confirmpassword){
         toast({
            title:"please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
         });
         setLoading(false);
         return;
        }
        if(password !== confirmpassword){
            toast({
                title:"password do not match",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
             });
             return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json", 
                },
            };
            const {data}= await axios.post("/api/user",{name , email , password  , pic},config);
            console.log(data)
            toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
             });
             localStorage.setItem('userInfo',JSON.stringify(data))
              setLoading(false);
             history.push("/chats")
            } 
            catch (error) {
                toast({
                    title:"error occured!",
                    description:error.response.data.messages,
                    status:"warning",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                 });
                 setLoading(false)
        }
    }
  return (
    <VStack spacing={'5px'}>
        <FormControl id='name' isRequired>
           <FormLabel>Name</FormLabel>
            <Input
            placeholder="Enter your Name"
            onChange={(e)=>setName(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id='email' isRequired >
           <FormLabel>Email</FormLabel>
            <Input
            placeholder="Enter your email"
            onChange={(e)=>setEmail(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id='password' isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>

            <Input
            type={show?"text": "password"}
            placeholder="Enter your Password"
            onChange={(e)=>setPassword(e.target.value)}
            ></Input>
            <InputRightElement>
                <Button h={'1.75rem'} size='sm' onClick={handleClick}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>

           </InputGroup>
        </FormControl>
        <FormControl id='password' isRequired>
           <FormLabel>Confirm Password</FormLabel>
           <InputGroup>

            <Input
            type={show?"text": "password"}
            placeholder="Enter your Password"
            onChange={(e)=>setconfirmpassword(e.target.value)}
            ></Input>
            <InputRightElement>
                <Button h={'1.75rem'} size='sm' onClick={handleClick}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>

           </InputGroup>
        </FormControl>
        <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
            <Input
            type='file'
            accept='image/*'
            onChange={(e)=>postDetails(e.target.files[0])}
            ></Input>

        </FormControl>


        <Button
        colorScheme='blue'
        width={"100%"}
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>

    </VStack>
  )
}

export default SignUp

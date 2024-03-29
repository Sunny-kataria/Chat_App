import React from 'react'
import { Button, FormControl,Input, FormLabel, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useState  } from 'react'
import { useHistory } from "react-router-dom"
import axios from "axios";

const Login = () => {
    const [show , setShow]=useState(false)
    const[name , setName]=useState();
    const[email , setEmail]=useState()
    const[password , setPassword]=useState()
  
    const [loading,setLoading]=useState(false);   
    const toast=useToast();
    const history=useHistory();
   
    const handleClick=()=>{
        setShow(!show)
    }
 
    
    const submitHandler=async()=>{
        setLoading(true);
        if(!email||!password){
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
        // if(password !== confirmpassword){
        //     toast({
        //         title:"password do not match",
        //         status:"warning",
        //         duration:5000,
        //         isClosable:true,
        //         position:"bottom",
        //      });
        //      return;
        // }
        try {
            const config={
                headers:{
                    "Content-type":"application/json", 
                },
            };
            const {data}= await axios.post("/api/user/login",{email , password },config);
            console.log(data)
            toast({
                title:"Login Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
             });
             localStorage.setItem('userInfo',JSON.stringify(data))
              setLoading(false);
             history.push("/chats")
            } catch (error) {
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
       

        <Button
        colorScheme='blue'
        width={"100%"}
        style={{marginTop:15}}
        onClick={submitHandler}
        >
           Login
        </Button>

        <Button
        variant={"solid"}
        colorScheme='red'
        width={"100%"}
        style={{marginTop:15}}
        onClick={()=>{
            setEmail("saggy@maggy.com");
            setPassword("shinchan nohara");
        }}
        >
           Get User Credentials
        </Button>

    </VStack>)

}

export default Login

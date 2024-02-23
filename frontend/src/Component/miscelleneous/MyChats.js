  import React, { useEffect, useState } from 'react'
  import { ChatState } from '../../Context/ChatProvider'
  import {  Button, Stack, useToast } from '@chakra-ui/react';
  import { AddIcon } from '@chakra-ui/icons'
  import {Box,Text} from "@chakra-ui/layout";
  import axios from 'axios';
  import ChatLoading from './ChatLoading';
  import GroupChatModal from './GroupChatModal';

  const MyChats = ({fetchAgain}) => {
    const[loggedUser,setLoggedUser]=useState();
    const {user  ,selectedChat , setselectedChat,chats,setChats}=ChatState();
    const toast=useToast();
    const fetchChats= async ()=>{
      try {
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };
        const {data}=await axios.get("/api/chat",config);
        // console.log(data)
        setChats(data);
      } catch (error) {
        toast({
          title:"error occured",
          description:'failed to load the chatssss',
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom-left",
      });
      }
    };
    
    // const getSender=(loggedUser,users)=>{
    //     return users[0]._id===loggedUser._id ? users[1].name : users[0].name;
    // }
    const getSender = (loggedUser, users) => {
      if (!users || users.length === 0) {
          return "Unknown User";
      }
      
      // Ensure that users[0] and users[1] exist before accessing their properties
      const sender = users[0]._id === loggedUser._id ? users[1] : users[0];
      return sender ? sender.name : "Unknown User";
  }

    useEffect(()=>{
      setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
      fetchChats();
    },[fetchAgain])
    return (
      <Box
   display={{base:selectedChat?"none":"flex",md:"flex"}}
   alignItems='center'
   flexDir={'column'}
   p={3}
   bg={'white'}
   w={{base:"100%",md:"31%"}}
   borderWidth={"1px"}
   borderRadius='lg'
   >
      <Box 
           w="100%"
           display='flex' 
          alignItems='center'
          justifyContent="space-between"
          fontFamily={'work sans'}
          fontSize={{base:"20px",md:'25px'}}
          px={3}
          pb={3}>
       My Chats

       <GroupChatModal>
       <Button
       display='flex' 
       fontSize={{base:"17px",md:'10px',lg:"17px"}}
      rightIcon={<AddIcon/>}
       >New Group</Button>
       </GroupChatModal>
      </Box>
     
     <Box
     display='flex' 
     flexDir={'column'}
     p={3}
     bg={"#F8F8F8"}
     w={"100%"}
     h={"100%"}
     borderRadius="lg"
     overflow="hidden"
     
     >
       {chats?(
        <Stack overflowY={"scroll"}>
         {
          chats.map((chat)=>{
           return  <Box
            onClick={()=>setselectedChat(chat)}
            cursor="pointer"
            bg={selectedChat===chat?"#38b2AC":"#E8E8E8"}
            color={selectedChat===chat?"white":"black"}
            px={3}
            py={2}
            borderRadius={'lg'}
            key={chat._id}
            >
                <Text>
                  {!chat.isGroupChat ? 
                  getSender(loggedUser,chat.users)
                  :chat.chatName}
                </Text>
            </Box>
          })
         }  
        </Stack>
       )
       :
       (<ChatLoading/>)}
     </Box>

   </Box>
    )
  }

  export default MyChats

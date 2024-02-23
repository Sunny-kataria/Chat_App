import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

import '@fortawesome/fontawesome-free/css/all.css';
import { ChatState } from '../../Context/ChatProvider';
import { Tooltip ,Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import {Box,Text} from "@chakra-ui/layout";
import { Button } from '@chakra-ui/button';
import { Avatar } from '@chakra-ui/avatar'
import{BellIcon , ChevronDownIcon}from "@chakra-ui/icons"
import ProfileModel from './ProfileModel';
import ChatLoading from './ChatLoading';
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge';


const SlideDrawer = () => {
  const [search , setSearch]=useState("");
  const[searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const[loadingChat,setLoadingChat]=useState();
  const {user,setselectedChat ,chats , setChats ,notification ,setNotification}= ChatState();

    const history = useHistory()
    const {isOpen , onOpen  , onClose}=useDisclosure();

    const toast=useToast();

   const handleSearch=async()=>{
    if(!search){
      toast({
        title:"please Enter something in search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left",
     });
    }
    try {
      setLoading(true)

      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };
      const {data}= await axios.get(`/api/user?search=${search}`,config)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title:"error occured in slidedrawer",
        description:"failed to load the search results",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
     });
    }
   };
   const getSender=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id ? users[1].name : users[0].name;
}


   const accessChat= async  (userId)=>{
    try {
      setLoadingChat(true)
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      };

      const{data}=await axios.post('/api/chat',{userId},config);
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);

      setselectedChat(data)
      setLoadingChat(false)
      onClose();
    } catch (error) {
      toast({
        title:"error occured in slidedrawer",
        description:error.message,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
     });
    }
   }

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push('/');
  };

  return (
    <>
    <Box 
display='flex'     justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px"
    >
        <Tooltip  label='search users to chat' hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick={onOpen}>
               <i className="fa-solid fa-magnifying-glass"></i>
              <Text display='flex'  px='4'>Search User</Text>
            </Button>
        </Tooltip>
      
        <Text fontSize="2xl" fontFamily="work sans">Talk-A-Tive</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
            />
              <BellIcon fontSize='2xl' m={1}></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setselectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
            <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
    
    <DrawerOverlay></DrawerOverlay>
    <DrawerContent>
         <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
   <DrawerBody>
    <Box display={{ md: "flex" }} pb={2}>
      <Input
        placeholder='Search by name or email'
        mr={2}
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />
      <Button onClick={handleSearch}>Go</Button>
    </Box>
     {loading?(<ChatLoading/>)
     :
     (searchResult?.map((user)=>
     <UserListItem
      key={user._id}
      user={user}
      handleFunction={()=>accessChat(user._id)}
     />
     ))}
        {  loadingChat && <Spinner ml='auto'display={{ md: "flex" }}/>}   </DrawerBody>
    </DrawerContent>
    </Drawer> 


    </>

  )
}

export default SlideDrawer;

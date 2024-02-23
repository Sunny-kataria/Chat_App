import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import SlideDrawer from '../Component/miscelleneous/SlideDrawer';
import MyChats from "../Component/miscelleneous/MyChats";
import ChatBox from "../Component/miscelleneous/ChatBox";
const ChatPage = () => {
   const {user}= ChatState()
   const [fetchAgain,setFetchAgain]=useState(false);
   
  return (
    <div style={{width:"100%"}}>
    {user && <SlideDrawer/>}
    <Box
     display="flex"
    justifyContent="space-between"
    w="100%"
    h="91.5vh"
    p="10px"
    >
        {user&& <MyChats  fetchAgain={fetchAgain} />}
        {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
  );
}

export default ChatPage

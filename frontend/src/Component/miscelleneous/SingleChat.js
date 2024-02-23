    import React, { useEffect, useState } from 'react'
    import { ChatState } from '../../Context/ChatProvider'
    import {Box,Text} from "@chakra-ui/layout";
    import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
    import { ArrowBackIcon } from '@chakra-ui/icons';
    import ProfileModel from './ProfileModel';
    import UpdatGroupChatModal from './UpdatGroupChatModal';
    import axios from 'axios';
    import "./style.css";
    import ScrollableChat from './ScrollableChat';
    import io from 'socket.io-client';
    import Lottie from 'react-lottie';
    import animationData from '../Animations/typing.json'
   
    
    const ENDPOINT="http://localhost:5000";
    
    var socket,selectedChatCompare;

    const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const [messages , setMessages]=useState([]);
    const[loading , setLoading]=useState(false);
    const[newMessage , setNewMessage]=useState("");
    const[socketConnected , setSocketConnected]=useState(false);
    const[typing , setTyping]=useState(false)
    const[istyping , setIsTyping]=useState(false)

    const defaultOptions={
      loop:true,
      autoplay:true,
      animationData:animationData,
      rendererSettings:{
        preserveAspectRatio:"xMidYMid slice",
      },
    };

    const toast=useToast();
     
    const {user ,notification ,setNotification, selectedChat,setselectedChat}= ChatState();

         const fetchMessages=async()=>{
            if(!selectedChat)return;
            try {
                const config = {
                   headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };
                  setLoading(true)
                  const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
                  console.log(messages)
                  setMessages(data)
                  setLoading(false)

                  socket.emit('join chat', selectedChat._id);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  }); 
            }
         }
            
        
         useEffect(()=>{
          socket=io(ENDPOINT);
          socket.emit("setup",user);
          socket.on('connected',()=>setSocketConnected(true))
          socket.on('typing',()=>setIsTyping(true))
          socket.on('stop typing',()=>setIsTyping(false))
         },[])

         useEffect(()=>{
          fetchMessages();
          selectedChatCompare=selectedChat;
         },[selectedChat])
         console.log(notification,"-----");

         useEffect(()=>{
         socket.on('message recieved',(newMessageRecieved)=>{
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification([newMessageRecieved, ...notification]);
              setFetchAgain(!fetchAgain);
            }
          } else {
            setMessages([...messages, newMessageRecieved]);
          }
        });
         }
         );
     


        const getSender=(loggedUser,users)=>{
            return users[0]._id===loggedUser._id ? users[1].name : users[0].name;
        }

        const getSenderFull=(loggedUser,users)=>{
            return users[0]._id===loggedUser._id ? users[1]: users[0].name;
        }
        const sendMessage = async (e) => {
            if (e.key === "Enter" && newMessage) {
             socket.emit('stop typing',selectedChat._id);
              try {
                const config = {
                  headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                };
                setNewMessage("");
                const { data } = await axios.post(
                  "/api/message",
                  {
                    content: newMessage,
                    chatId: selectedChat,
                  },
                  config
                );
               
                console.log(data);
                socket.emit('new message',data);
                setMessages([...messages, data]);
              } catch (error) {
                toast({
                  title: "Error Occured!",
                  description: "Failed to send the Message",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
              }
            }
          };
        const typingHandler=(e)=>{
            setNewMessage(e.target.value);

            if(!socketConnected)return;

            if(!typing){
              setTyping(true)
              socket.emit("typing",selectedChat._id);
            }

            let lastTypinTime=new Date().getTime()
            var timerLength=3000;
            setTimeout(() => {
              var timeNow=new Date().getTime();
              var timeDiff=timeNow-lastTypinTime;
              if(timeDiff>=timerLength && typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
              }
            }, timerLength);
            
        }
   
    
        return (
        <>{
        selectedChat?(
        <>
            <Text
            fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w={"100%"}
            display="flex"
            fontFamily="work sans"
            alignItems={"center"}
            justifyContent={{base:"space-between"}}
            >
                <IconButton
                display={{base:"flex",md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick={()=>setselectedChat("")}
                /> 
                {
                    !selectedChat.isGroupChat ?
                    (
                        <>
                            {getSender(user,selectedChat.users)}
                            <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
                        </>
                    )
                    :
                    (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdatGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )
                }           
            </Text>

                            <Box
                            flexDir={"column"}
                            w={"100%"}
                            h='100%'
                            bg={"#E8E8E8"}
                            display="flex"
                            fontFamily="work sans"
                            justifyContent='flex-end'
                            borderRadius={"lg"}
                            overflow={"hidden"}
                            
                            >
                            {
                                loading?(<Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />)
                            :
                            (<div className='messages'>
                               <ScrollableChat messages={messages}/>
                            </div>)
                            }
                            <FormControl onKeyDown={(sendMessage)} isRequired mt={3}>
                                {istyping?<div>
                                  <Lottie
                                  options={defaultOptions}
                                   width={70}
                                   style={{marginBottom:15,marginLeft:0}}

                                  />
                                </div>:(<></>)}
                                <Input
                                    variant={"filled"}
                                    bg={"#E0E0E0"}
                                    placeholder='Enter a message...'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                            </Box>
        </>
    ):(
        <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        h="100%"
        >
            <Text
            fontSize='3xl'
            pb={3}
            fontFamily="work sans"
            >Click on a user to start chatting</Text>
        </Box>
    )

        }
        </>
        );
    }

    export default SingleChat

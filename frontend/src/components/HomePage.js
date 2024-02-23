import React, { useEffect } from 'react'

import Login from '../Component/Authentication/Login'
import SignUp from '../Component/Authentication/SignUp'
import{Container ,Box ,Text,TabList,TabPanel,TabPanels ,Tab,Tabs} from "@chakra-ui/react"
import { useHistory } from 'react-router-dom';
const HomePage = () => {

  const history = useHistory();
  useEffect(()=>{
     const user= JSON.parse(localStorage.getItem("userInfo"));
     
      if(user){
          history.push('/chats');
      }
  },[history])

  return (
    <div>
     <Container maxW="xl" centerContent>
       <Box d="flex" justifyContent="center" p={3} bg={"white"} w="100%"m="40px 0 15px 0" borderRadius="1g" borderWidth="1px">
          <Text fontSize='4xl' fontFamily="work sans"color={'black'}>
            Talk-A-Tive
           </Text>
       </Box>


       {/* second box after heading */}
       <Box bg="white" w="100%"p={4} borderWidth="1px" borderColor={"black"} borderRadius='1px'>
       <Tabs variant='soft-rounded' >
  <TabList mb={'1em'}>
    <Tab width={'50%'}>Login</Tab>
    <Tab width={'50%'}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
          <Login/>
    </TabPanel>
    <TabPanel>
         <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
       </Box>
     </Container>
    </div>
  )
}

export default HomePage

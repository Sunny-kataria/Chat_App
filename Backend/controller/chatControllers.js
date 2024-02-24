const asyncHandler=require("express-async-handler");
const Chat = require("../Models/chatModel")
const User = require("../Models/UserModel"); // Import UserModel.js only once


const accessChat=asyncHandler(async(req,res)=>{
   const {userId}= req.body;
   if(!userId){

    console.log("userId param not sent with reuest(chatController)")
    return res.sendStatus(400)
   }
   var isChat=await Chat.find({
    isGroupChat:false,
    // $and:[
    //     {users:{$elementMatch:{$eq:req.user._id}}},
    //     {users:{$elementMatch:{$eq:userId}}}
    // ]
    $and:[
        {users: {$elemMatch: {_id: req.user._id}}}, // Update: Changed $elementMatch to $elemMatch, and $er to _id
        {users: {$elemMatch: {_id: req.userId}}}  // Update: Changed $elementMatch to $elemMatch, and $er to _id
    ]
   }).populate("users","-password").populate("latestMessage");

   isChat=await User.populate(isChat,{
    path:"latestMessage.sender",
    select:"name pic email",
   });
     
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };

        try {
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id: createdChat._id}).populate("users","-password");
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});
const fetchChat=asyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
             results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email",
             });
               res.status(200).send(results);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// const fetchChat = asyncHandler(async (req, res) => {
//     try {
//         // Ensure that user information is properly populated in the request object
//         if (!req.user || !req.user._id) {
//             throw new Error("User ID is not defined");
//         }

//         const userId = req.user._id;

//         // Fetch chats where the user's ID is included in the users array
//         const results = await Chat.find({
//             users: { $elemMatch: { _id: userId } }
//         })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 });

//         // Populate sender information for latestMessage
//         const populatedResults = await User.populate(results, {
//             path: "latestMessage.sender",
//             select: "name pic email"
//         });

//         // Send the populated chat data in the response
//         res.status(200).send(populatedResults);
//     } catch (error) {
//         // Handle errors gracefully
//         console.error("Error in fetchChat:", error);
//         res.status(400).json({ message: error.message });
//     }
// });





const createGroupChat=asyncHandler(async(req,res)=>{
   if (!req.body.users||!req.body.name){
    return res.status(400).send({message:"please fill all the fields"});
   }
   var users =JSON.parse(req.body.users);

   if(users.length<2){
    return res.status(400).send("more than 2 users are required to form a group chat");}
    try {
      users.push(req.user)
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupChat=await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
    
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}
);
const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!updatedChat){
        res.status(404);
        throw new Error("chat Not found");
    }else{
        res.json(updatedChat);
    }
    
});
const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(
      chatId,
      {
          $pull:{users:userId},
          
      },
      {new:true}
  
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!removed){
      res.status(404);
      throw new Error("chat Not found");
  }else{
      res.json(removed);
  }
  
});
const addToGroup=asyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body;
  const added=await Chat.findByIdAndUpdate(
    chatId,
    {
        $push:{users:userId},
        
    },
    {new:true}

  )
  .populate("users","-password")
  .populate("groupAdmin","-password");
  if(!added){
    res.status(404);
    throw new Error("chat Not found");
}else{
    res.json(added);
}

});





module.exports={accessChat,addToGroup,removeFromGroup,renameGroup , fetchChat ,createGroupChat}
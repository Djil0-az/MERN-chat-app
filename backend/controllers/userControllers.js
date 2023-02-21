const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');


const signupUser = asyncHandler( async (req,res)=> {
   const{name,email,password,pic} = req.body;
   const emailRegex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

    const validateEmail = ()=>{
      return emailRegex.test(email);        
    };
    
   if(!name||!email||!password){
    res.status(400);
    throw new Error("Please enter all fields!");
   }
   if(!validateEmail){
    res.status(400);
    throw new Error("please enter valid email")
   }

   //check if user already exists 
   //query mongoDB
   const userExists = await User.findOne({email});
   if(userExists){
    res.status(400);
    throw new Error("User already exists!");
   }
//    if no errors then create user 
const user = await User.create({
    name,
    email,
    password,
    pic,
});

if(user){
    // user creation is successful
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
    });
}else{
    res.status(400);
    throw new Error("Failed to create user!");
}
});
// user authentication 
// if user exists check if password matches

const authUser = asyncHandler(async(req,res)=>{
    const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
// All users controller
// /api/user?search= _user1 API route


// (user query to send data to backend)
    //if there is a query search userDB for name and email return if query matches
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};// else do nothing 
//query db for users except current logged in user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {signupUser,authUser,allUsers};
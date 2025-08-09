const express=require("express")
require("dotenv").config();
const { default: mongoose } = require("mongoose")
const shortid = require("shortid")
const cookieParser = require("cookie-parser")
const cors=require("cors")
const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//app.use(express.static(__dirname))
app.use(cookieParser())
app.use(cors({
    origin:"https://to-do-app-1-qw5i.onrender.com",
    credentials:true
}))
let User=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:
    {
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userId:{
        type:String
    }
})
let Task=new mongoose.Schema({
    task:{
        type:String,
    },
    taskAddedAt:
    {
        type:String
    },
    taskId:
    {
        type:String,
        required:true
    },
    status:
    {
        type:Boolean
    }
})
let TodoUser=mongoose.model("todouser",User)
let Taskdb=mongoose.model("todoTask",Task)
mongoose.connect(process.env.MONGO_URI)
.then((val)=>{console.log("Database Connected")})
.catch((err)=>{console.log("Database Crashed")})
app
// .get('/',(req,res)=>
// {
//     res.sendFile(__dirname+'/signup.html')
// })
// .get('/login',(req,res)=>
// {
//     res.sendFile(__dirname+'/login.html')
// })
// .get('/application',(req,res)=>
// {
//     res.sendFile(__dirname+'/ToDo.html')
// })
.post('/signup',async (req,res)=>
{
    try{
    let {username,email,password}=req.body;
       await TodoUser.create({
        username:username,
        email:email,
        password:password,
        userId:shortid()
      })
      res.status(200).redirect('/login')
    }
    catch(err)
    {
       return res.json({message:"error"})
    }

})
.post('/login',async (req,res)=>
{
   try{ 
        let {email,password}=req.body;
        let User=await TodoUser.findOne({email:email,password:password})
        if(User)
        {
            res.cookie("User",User.userId)
           return res.status(200).redirect("/application")
        }
    }
    catch(error)
    {
     res.json({msg:"error"});
    }
})
.post('/addTask',async (req,res)=>
{
   try{
    let {task}=req.body
    let id=req.cookies.User
    let taskCreated=await Taskdb.create({
       task:task,
       taskAddedAt:new Date().toLocaleString(),
       taskId:id,
       status:false
    })
     return res.json({msg:taskCreated,})
}
catch{
    return res.json({msg:'error'})
}
})
app.get('/getTask',async (req,res)=>
{
    try
    {
    let userId=req.cookies.User
   let totalTask=await Taskdb.find({taskId:userId})
   return res.json(totalTask)
    }
    catch(err)
    {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
})
app.delete('/deleteTask/:id',async (req,res)=>
{
  let idTaskToDelete=req.params.id
  await Taskdb.findByIdAndDelete(idTaskToDelete)
})
app.post("/editTask/:id",async (req,res)=>
{
    let id=req.params.id
    let {newValue}=req.body;
    await Taskdb.findByIdAndUpdate({_id:id},{$set:{task:newValue}})
    res.json("ok")
})
app.post('/updateStatus/:id',async (req,res)=>
{
    let id=req.params.id;
    let {status}=req.body;
     await Taskdb.findByIdAndUpdate({_id:id},{$set:{status:status}})
    res.json("ok")
})
app.listen(process.env.PORT,'0.0.0.0',()=>{console.log("Server started")})

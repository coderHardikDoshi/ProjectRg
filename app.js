const express = require('express')
require('dotenv').config()
console.log(process.env.PORT)
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3600

const fs = require('fs')
const { json } = require('stream/consumers')
//const data = fs.readFileSync('./data.json','utf8')
//const userData = JSON.parse(data);
//console.log(userData)
const uuid = require('short-uuid')
const { type } = require('os')

const app = express()
app.use(express.json())//this is a middleware,it's parsing the json which was sent via post rquest and converting to json object

/**app.use((req,res,next)=>{
    console.log(`${req.path} send to ${req.method} `)
    next()
})*/

/**DB connection starts */
mongoose
.connect(process.env.DB_URL)
.then((connection) => {
    console.log("DB connected successfully");
})
.catch((errr) => {
    console.log(errr);
});
/**DB conection ends here */

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:8,
        validate:{
            validator:function(){
                return this.password === this.confirmPassword;
            }
        }
    },
    createdAt:Date,
    id:String
});

const User = new mongoose.model("User",userSchema);


app.post('/api/user',createUserHandler)//post request
app.get('/api/user',getUserHandler)//get request
app.get('/api/user/:id',getUserById)//dynamic routing

async function getUserHandler(req,res) {
    try{
    let msg = ''
    const userData = await User.find()

    if(userData.length==0){
        msg = "User not found"
    }
    else{
        msg = " User found below:-"
    }
    res.json({
        statusCode : 200,
        status : 'success',
        message : msg,
        data: userData
    })
    }
    catch(err){
        console.log('We have got an error',err);
        res.json({
            statusCode:500,
            message:'Error here',
            data:err
        })
    }
}

async function createUserHandler(req,res){
   // const id = uuid.generate();
   try{
    const userDetails = req.body;
    let isEmpty = null;
    if(Object.keys(userDetails).length===0){
        isEmpty = true;
    }
    else{
        isEmpty = false;
    }
        if(isEmpty){
            console.log("user here:",userDetails)
            console.log("check one:",isEmpty)
            res.json({
                status:400,
                message:"Bad Request , body cannot be empty"
            })
        }
    else{
        console.log("User details",userDetails)
        const user = await User.create(userDetails)
        res.status(201).json({
            message:"User created successfully.",
            status:"201",
            data:user
        })
    }
}
catch(err){
    console.log("erorr here",err);
    res.status(500).json({
        status:"500",
        data:err
    })
}
    };

async function getUserById(req,res){
    const {id} = req.params;
   // const user = userData.find((user)=>user.id==id)
   const user = await User.findById(id);
    if(!user){
        res.status(404).json({
            status:404,
            message:'Not found'
        })
        throw new Error("User not found");
    }
    else{
        //user.age = user.age +1;
        res.status(200).json({
            status:200,
            message : 'user found',
            data : user
        })
        console.log("yayy found them",user)
    }

}

app.use(function(req,res){
    res.status(404).send('Not Found')
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
const express = require('express')
require('dotenv').config()
console.log(process.env.PORT)
const PORT = process.env.PORT || 3300

const fs = require('fs')
const { json } = require('stream/consumers')
const data = fs.readFileSync('./data.json','utf8')
const userData = JSON.parse(data);
//console.log(userData)
const uuid = require('short-uuid')

const app = express()
app.use(express.json())//this is a middleware,it's parsing the json which was sent via post rquest and converting to json object

app.use((req,res,next)=>{
    console.log(`${req.path} send to ${req.method} `)
    next()
})

app.get('/api/user',(req,res)=>{
    try{
    let msg = ''
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
        console.log('We have got an error');
        res.json({
            statusCode:500,
            message:'Error here'
        })
    }
})

app.post('/api/user',(req,res)=>{
    const id = uuid.generate();
    const userDetails = req.body;
    const isEmpty = Object.keys(userDetails.length===0);
        if(isEmpty){
            res.json({
                status:400,
                message:"Bad Request , body cannot be empty"
            })
        }
    else{
    userDetails.id = id;
    userData.push(userDetails);
    fs.writeFile('./data.json', JSON.stringify(userData) ,(err) =>{
        if(err){
            console.log('check for error')
        }
        else{
            console.log("entery created.")
            res.json({
                status:200,
                message:'Entery created successfully',
                data:userDetails
            })
        } 
    })
}
    });

app.patch('/api/user/:id',(req,res)=>{
    const {id} = req.params;
    const user = userData.find((user)=>user.id==id)
    if(!user){
        res.status(404).json({
            status:404,
            message:'Not found'
        })
        throw new Error("User not found");
    }
    else{
        user.age = user.age +1;
        res.status(200).json({
            status:200,
            message : 'user updated',
            data : user
        })
        console.log("yayy updated",user.age)
    }

})

app.use(function(req,res){
    res.status(404).send('Not Found')
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
const express = require('express')
require('dotenv').config()
console.log(process.env.PORT)
const PORT = process.env.PORT || 3300

const app = express()
app.use(express.json())//this is a middleware,it's parsing the json which was sent via post rquest and converting to json object

app.use((req,res,next)=>{
    console.log(`${req.path} send to ${req.method} `)
    next()
})
app.get('/api/user',(req,res)=>{
    res.json({
        statusCode : 200,
        status : 'success',
        data:{
            name : 'Hardik',
            age : 26
        } 
    })
})

app.post('/api/user',(req,res)=>{
    console.log("req body",req.body)
    res.json({
        data:req.body
    })
})

app.use(function(req,res){
    res.status(200).send('Working fine')
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
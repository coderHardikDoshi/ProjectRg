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

const {createUserHandler,
    getUserHandler,
    checkInput,
    getUserById,
    updateUserById,
    deleteUserById
} = require("./controllers/userController");

const{
    deleteProductById,
    updateProductById,
    getProductById,
    createProductHandler,
    getProductHandler,
} = require("./controllers/productController")

const User = require("./models/userModel");

const Product = require("./models/productModel");
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

/**user routes */
app.post('/api/user',checkInput,createUserHandler)//post request
app.get('/api/user',getUserHandler)//get request
app.get('/api/user/:id',getUserById)//dynamic routing
app.patch('/api/user/:id',updateUserById)
app.delete('/api/user/:id',deleteUserById)

/**product routes*/
app.post('/api/product',checkInput,createProductHandler)//post request
app.get('/api/product',getProductHandler)
app.get('/api/product/:id',getProductById)
app.patch('/api/product/:id',updateProductById)
app.delete('/api/product/:id',deleteProductById)




app.use(function(req,res){
    res.status(404).send('Not Found')
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
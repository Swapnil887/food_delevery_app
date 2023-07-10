const express = require("express")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { Usermodel } = require("../model/user.model");
const { Restaurantmodel } = require("../model/restaurant .model");
const { Ordermodel } = require("../model/order.model");
const { authenticate } = require("../middleware.js/authenticate");

const userRoute = express()


// register route
userRoute.post("/register",async (req,res)=>{
    const {name,email,password,address} = req.body;
    try {
        var findData = await Usermodel.find({email})
        console.log(findData)
        if(findData.length==0){

            var hash = await bcrypt.hash(password,5)
            
            var data = Usermodel({name,email,password:hash,address})
            var x = await data.save()
            console.log(x)

            res.send("register").status(201)
        }else{
            res.send("user already present").status(201)
        }
    } catch (error) {
        console.log(error)
        res.send("something went wrong in register")
    }
})


// signup route

userRoute.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    try {
        var findData = await Usermodel.find({email})
        console.log(findData)
        if(findData.length==0){
            res.send("You have to register first")
        }else{
            var dataPassword = findData[0].password;
            var result = await bcrypt.compare(password,dataPassword)
            
            if(result){
                var token = jwt.sign({email},process.env.tokenKey)
                res.send({token}).status(201)
            }else{
                res.send("Wrong password").status(201)
            }
            
        }
    } catch (error) {
        console.log(error)
        res.send("something went wrong in register")
    }
})

//reset password route

userRoute.patch("/user/:id/reset",async (req,res)=>{
    const id = req.params.id;
    const newPassword = req.body.password
    var hash = await bcrypt.hash(newPassword,5)
    try {
        const data = await Usermodel.updateOne({_id:id},{password:hash})
        console.log(data)
        res.send("password updated").status(204)
    } catch (error) {
        console.log(error)
        res.send("something went wrong while reset password")
    }
})


// get all restaruent route

userRoute.get("/restaurants",authenticate,async (req,res)=>{
    try {
        var data = await Restaurantmodel.find()
        res.send(data).status(200)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in get all restarunt route")
    }
})


//get restarteunt by id

userRoute.get("/restaurants/:id",authenticate,async (req,res)=>{
    var id = req.params.id
    try {
        var data = await Restaurantmodel.findOne({_id:id})
        res.send(data).status(200)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in get all restarunt route")
    }
})

//return menu of specific restarutent

userRoute.get("/restaurants/:id/menu",authenticate,async (req,res)=>{
    var id = req.params.id
    try {
        var data = await Restaurantmodel.findOne({_id:id})
        res.send(data.menu).status(200)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in get all restarunt route")
    }
})


//post new item on menu

userRoute.post("/restaurants/:id/menu",async (req,res)=>{
    var id = req.params.id
    var data = req.body
    try {
        var data = await Restaurantmodel.updateOne({_id:id},{$push:{menu:data}})
        res.send("menu updated with new item").status(201)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in get all restarunt route")
    }
})

// delete perticular item from menu

userRoute.delete('/restaurants/:id/menu/:Id',authenticate,async(req,res)=>{
    const restarteuntId = req.params.id;
    const menuID = req.params.Id;

    var data = await Restaurantmodel.updateOne({_id:restarteuntId},{$delete:{_id:menuID}})
    res.send(data).status(202)
})

//place order

userRoute.post('/orders',authenticate,async(req,res)=>{
    const data = req.body;
    try {
        const userData = await Usermodel.find({_id:data.user})
        console.log(data)
        const userAddress = userData[0].address;
        var  totalPrice = 0;

        for(var i=0;i<data.items.length;i++)
        {
            totalPrice+=data.items[i].price*data.items[i].quantity
        }
        var obj = {
            ...req.body,
            deliveryAddress:userAddress,
            totalPrice,
            status:"preparing"
        }

        var x = Ordermodel(obj)
        var y = await x.save()
        console.log(y)
        res.send(obj).status(201)
    } catch (error) {
     console.log(error)
     res.send("something went wrong while order place")   
    }
})

//return detail of specific order

userRoute.get("/orders/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const data = await Ordermodel.find({_id:id}).populate("user").populate("restaurant")
        res.send(data).status(200)
    } catch (error) {
        console.log(error)
        res.send("something went wrong while get order")
    }
})

//update status
userRoute.patch("/orders/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const data = await Ordermodel.updateOne({_id:id},{status:req.body.status})
        console.log(data)
        res.send("status updated").status(204)
    } catch (error) {
        console.log(error)
        res.send("something went wrong win update status of order")
    }
})




// post  restaurent

userRoute.post("/restaurants/",async (req,res)=>{
    const data = req.body
    try {
        var x = Restaurantmodel(data)
        var y = await x.save()
        console.log(y)
        res.status(204).send("data post")
    } catch (error) {
        console.log(error)
        res.send("something went wrong in get all restarunt route")
    }
})



module.exports = {userRoute}
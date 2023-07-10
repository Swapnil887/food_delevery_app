
const jwt = require("jsonwebtoken")
const { Usermodel } = require("../model/user.model")

const authenticate = async (req,res,next)=>{
    const token  = req.headers.authorization
    try {
        
        if(token){
            var x = await jwt.verify(token,process.env.tokenKey)
            const userData = await Usermodel.find({email:x.email})
            req.body.email = x.email
            req.body.user = userData[0]._id
            console.log(userData[0]._id,x.email)
            next() 
        }else{
            res.send("you have to login first")           
        }
    } catch (error) {
        console.log("something went wrong in middlewar")
        res.send("eerr")
    }
}

module.exports = {authenticate}
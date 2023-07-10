const { connection } = require("./config.js/db")

const express = require("express")
const { userRoute } = require("./routes.js/user.route")
require("dotenv").config()
const app = express()



app.use(express.json())

app.get("/",(req,res)=>{
    res.send("welcome")
})
app.use("/api",userRoute)

app.listen(process.env.port,async ()=>{
    await connection
    console.log("server is running")
})
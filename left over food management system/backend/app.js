const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const foodRoutes = require("./routes/foodRoutes"); 

const app=express()
app.use(express.json())
app.use(cors())
app.use("/auth", authRoutes);


app.use("/admin", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/api/foods",foodRoutes);

//access env values
require('dotenv').config()
//connect to MongoDB
const dbUrl=process.env.MONGODBURL
async function main()
{
    await mongoose.connect(dbUrl)
}
main()

    .then(()=>console.log("DB connected"))
    .catch(err=>console.log(err))

    app.get('/',(req,res)=>{
        res.send("Hello")
    })


    const port=process.env.PORT || 3000
    app.listen(port,()=>{
    console.log("Server has started...")
    })


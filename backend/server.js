const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();

const reviewRouter=require("./routes/review.route");
const app= express();


app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.status(200).json({success:true,message:"Server is running"});
});

app.use("/review",reviewRouter)


const PORT= process.env.PORT ||5000;


app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
})

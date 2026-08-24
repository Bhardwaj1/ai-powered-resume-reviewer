const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const multer = require("multer");
dotenv.config();

const reviewRouter=require("./routes/review.route");
const app= express();


app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.status(200).json({success:true,message:"Server is running"});
});

app.use("/review",reviewRouter)

app.use((error, req, res, next) => {
  console.error("Error:", error.message);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 5MB",
      });
    }
  }

  return res.status(400).json({
    success: false,
    message: error.message || "Something went wrong",
  });
});


const PORT= process.env.PORT ||5000;


app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
})

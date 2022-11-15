const cloudinary = require('cloudinary').v2;
const dotenv=require('dotenv');
const fs=require("fs")
dotenv.config();


cloudinary.config({ 
  cloud_name:`${process.env.CLOUD_NAME}`, 
  api_key:`${process.env.API_KEY}`, 
  api_secret:`${process.env.API_SECRET}`
});


module.exports.upload=async(req, res, next)=>{
  
  try {
    const filePath=req.file.path
    const result=await cloudinary.uploader.upload(filePath, {folder:"vue_image"})
    console.log(result)
    res.locals.result=result;
} catch (err) {
    console.log(err)
    res.json({msg:'Some thing went wrong'})        
}

next()

}




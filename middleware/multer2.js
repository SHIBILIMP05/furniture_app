const multer2 = require("multer");
const path = require("path")
const fs = require("fs");

const storage = multer2.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"../public/products/images"))
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"-"+ Date.now()+path.extname(file.originalname))
    }
})

const upload = multer2({storage:storage})
const productImagesUpload2 = upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1},
])
module.exports = {productImagesUpload2}
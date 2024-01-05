const multer = require("multer");
const path = require("path")
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, path.join(__dirname, "../public/products/images"));
    },
    filename: function (req, file, cb) {
       cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
 });
 
 const upload = multer({ storage: storage });
 
 const productImagesUpload = upload.array("images", 4); // Limiting to 4 images, adjust as needed
 

module.exports = {productImagesUpload}
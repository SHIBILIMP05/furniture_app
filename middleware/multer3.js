const multer3 = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration for handling file uploads
const storage = multer3.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../public/banner"));
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer3({ storage: storage });
const bannerUpload = upload.single("image");
module.exports = {bannerUpload}
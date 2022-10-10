const multer = require("multer");
const upload = multer({ // dest: "avatar",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/gm)) 
            return cb(new Error("only png , jpeg , jpg files are allowed"));
        
        cb(undefined, true);
    }
});

module.exports = upload;

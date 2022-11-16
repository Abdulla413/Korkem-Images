const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const cors=require("cors");
const uidsafe = require("uid-safe");  
const path = require("path");
const cloudinary=require("./cloudinary/coloudinary.js");
const { url } = require("inspector");




app.use(express.urlencoded({ extended: false }));
const options = {
    origin: ['http://localhost:5000','http://localhost:8080'],
    }
    app.use(cors(options));


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file)
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidsafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2500000,
    },
});

app.use(express.static("./public"));

app.use(express.json());


app.get("/api/images", (req, res) => {
    db.getInfo()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});



app.post("/api/images", uploader.single("image_file"), cloudinary.upload, async (req, res) => {
    
    const {username, title, description}=req.body;
   const {result}=res.locals;
   console.log(result, "i am a result from res.locals")
   const url=result.secure_url;

    db.addImage(url, username, title, description)
        .then((result) => {
            res.json({data:result.rows[0], msg:"Image Uploaded Successfully"});
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});


app.post("/api/comment", (req, res) => {
    const { content, username, imageid } = req.body;
    db.addComments(content, username, imageid)
        .then((result) => {
            res.json({data:result.rows[0],
                msg:"Comment submit successfully"
            });
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

app.get("/api/comments/:imageid", (req, res) => {
    db.getAllComments(req.params.imageid)
        .then((result) => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

app.get("/api/images/more", (req, res) => {
    const { after } = req.query;
    console.log(after, " iam after");
    db.getMoreImages(after)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500).json("Some thing went rong");
        });
});

app.get("/api/images/:id", (req, res) => {
    db.getInfoById(req.params["id"])
        .then((result) => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
                console.log(result.rows[0]);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

app.post("/api/image/delete", (req, res) => {
    console.log(req.body, "men bodighu balangza");
    const { imageId } = req.body;
    db.deleteComment(imageId)
        .then((result) => {
            console.log(result, "iam result in delete server")
            db.deleteImage(imageId).then((result2) => {
                console.log(result2, "i ma result2 to delter image in server")
                console.log(result2);
            });
        })
        .then((result3) => {
            
            console.log(result3, "i ma result3 for delte in server");
            res.sendStatus(202);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});



if(process.env.NODE_ENV==="production"){
    //Static folder
    app.use(express.static(__dirname + '/public/'));
    // Handle SPA
    app.get("*", (req, res) => {
        res.sendFile(`${__dirname}/public/index.html`);
    });
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`I'm listening posrt ${port}`));

const Pool=require("pg").Pool;
const dotenv=require('dotenv');
dotenv.config();
const db = new Pool({
    user:`${process.env.POSTGRES_USER}`,
    password:`${process.env.POSTGRES_PASSWORD}`,
    host:`${process.env.POSTGRES_HOSTNAME}`,
    port:`${process.env.POSTGRES_PORT}`,
    database:`${process.env.POSTGRES_DB}`
})

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("Database Connetcted")
})


const { query } = require("express");



module.exports.getInfo = (id) => {
    return db.query(
        `SELECT *,
        (SELECT id FROM images ORDER BY id LIMIT 1) AS lowestid
        FROM images ORDER BY id=$1 ASC LIMIT 6;`,
        [id]
    );
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;",
        [url, username, title, description]
    );
};

module.exports.getInfoById = (id) => {
    return db.query("SELECT * FROM images WHERE id= $1", [id]);
};

module.exports.getMoreImages = (after) => {
    return db.query(
        `SELECT *,
        (SELECT id FROM images ORDER BY id LIMIT 1) AS lowestid
        FROM images WHERE id>$1 ORDER BY id DESC LIMIT 6;`,
        [after]
    );
};

module.exports.addComments = (content, username, imageid) => {
    return db.query(
        "INSERT INTO comments (content, username, image_id) VALUES ($1, $2, $3) RETURNING *;",
        [content, username, imageid]
    );
};

module.exports.getAllComments = (imageid) => {
    return db.query(
        "SELECT content, username, created_at FROM comments WHERE image_id=$1 ",
        [imageid]
    );
};

module.exports.deleteImage = (id) => {
    return db.query("DELETE FROM images WHERE id=$1;", [id]);
};
module.exports.deleteComment = (id) => {
    return db.query("DELETE FROM comments WHERE image_id=$1;", [id]);
};

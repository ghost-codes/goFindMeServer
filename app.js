const express = require('express');
const jwt = require('jsonwebtoken');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Routes import
const postRoute = require('./routes/posts');
const helmet = require('helmet');

dotenv.config();



let gfs;
mongoose.connect(
    process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
    (error, db) => {
        console.log("Connected to MongoDB");
    }
);

const conn = mongoose.createConnection(process.env.MONGO_URL,);

conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
})




const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function (req, file, cd) {
        cd(null, new Date().toISOString() + file.originalname)
    }
});

// checkking connection
app.get('/api/', (req, res) => {
    res.json("Connected");
});

app.use("/api/posts", postRoute);

// managing file and media retrieval
app.get('/api/post/:filename', async (req, res) => {
    const filename = req.params.filename;

    try {

        const file = await gfs.files.findOne({ filename: req.params.filename });
        console.log(file.filename);
        const readSream = gfs.createReadStream(file.filename);

        readSream.pipe(res);
    } catch (err) {
        console.log(err);
        res.json("err");
    }
});
// Trying gridfs for image storage



// Start Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
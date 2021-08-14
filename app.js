const express = require('express');
const jwt = require('jsonwebtoken');
const gfs = require('gridfs-stream');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Routes import
const postRoute = require('./routes/posts');
const helmet = require('helmet');

dotenv.config();



mongoose.connect(
    process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
    (error, db) => {
        console.log("Connected to MongoDB");
    }
);




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

// Trying gridfs for image storage

app.use("/api/posts", postRoute);


// Start Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
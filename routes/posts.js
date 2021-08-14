const router = require('express').Router();
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const path = require('path');
const express = require('express');
const multer = require('multer');



// create a post\
router.post("/", upload.array('uploads', 4), async (req, res) => {

    const files = req.files
    if (!files.length === 0) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        res.status(400).json("No image selected");
        return next("hey error")
    }
    let filePaths = [];

    files.forEach((file) => {
        filePaths.push(`https://go-find-me.herokuapp.com/api/posts/${file.filename}`);
    });
    req.body.imgs = filePaths;


    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// update a post
router.put("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The Post has been updated");
        } else {
            res.status(403).json("You can only update your posts")
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The Post has been deleted");
        } else {
            res.status(403).json("You can only delete your posts")
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


// contribute to a post


// get a post
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json("Post not found");
        }
    } catch (err) {
        res.status(500).json(e);
    }
});
// get timeline based on followins posts

// // dummy image upload
// router.use('/uploads', express.static(__dirname + '/uploads'));
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '/uploads/'));
//     },
//     filename: function (req, file, cd) {
//         cd(null, new Date().toISOString() + file.originalname)
//     }
// });

// var upload = multer({ storage: storage });
router.post('/upload', upload.array('uploads', 4), async (req, res, next) => {
    console.log(req.body);
    const files = req.files
    console.log(files);

    if (!files.length === 0) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next("hey error")
    }
    // files.for

    const imagepost = new model({
        image: file.path
    })
    const savedimage = await imagepost.save();
    res.json(savedimage);
})

module.exports = router;
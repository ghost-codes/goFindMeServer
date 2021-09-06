const router = require('express').Router();
const Contribution = require("../models/Contribution");
const Post = require("../models/Post");


// create new Contribution
router.post("/", async (req, res) => {
    const newContribution = new Contribution(req.body);
    try {
        console.log(req.body);
        const savedContribution = await newContribution.save();
        console.log(savedContribution);
        const post = await Post.findById(savedContribution.post_id);
        post.contributions = [savedContribution.id];
        await post.updateOne({ $set: post });

        res.status(200).json(savedContribution);
    } catch (err) {
        console.log(err);
        con
        res.status(500).json(err);
    }
});

module.exports = router;
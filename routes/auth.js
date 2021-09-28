const User = require('../models/User')
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let refreshTokens = [];

const secret = "AccessTokenForGoFindMeServerHope";
const refreshSecret = "RefreshTokenforGoFindMeServerHope";



const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, secret, { expiresIn: "15m", });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, refreshSecret, { expiresIn: "15m", });
}

// Sing Up new user with email and password
router.post("/sign_up/email", async (req, res) => {
    const body = req.body;

    bcrypt.hash(body.password, 10, async (err, hash) => {
        if (!err) {
            body.password = hash;
            const newUser = new User(body);
            try {
                const savedUser = await newUser.save();
                const accessToken = generateAccessToken(savedUser);
                const refreshToken = generateRefreshToken(savedUser);
                res.status(200).json({ message: "Sign up successfull", user: { id: savedUser.id, username: savedUser, photo_url: savedUser.photo_url, email: savedUser.email, }, accessToken, refreshToken })
            } catch (e) {
                console.log(e);
                res.status(500).json({ e });
            }
        } else {
            res.status(500).json({ err: err });
        }
    })

})

router.post("/refresh", (req, res) => {
    // take the refresh token from the user
    const token = req.body.token;

    // send error if ther is not token or its invalid
    if (!refreshToken) return res.status(401).send("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send("Refresh token is not valid!");
    }

    jwt.verify(refreshToken, refreshSecret, (err, user) => {
        err && console.log(err);

        refreshTokens.filter(token => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });

    // if everything is oh, create new access token, refresh token and send to user
});

// Login using email and password
router.post('/login/email', async (req, res) => {

    const { identity, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username: identity }, { email: identity }] });
        if (user) {
            // Bcrypt password
            bcrypt.compare(password, user.password, async (err, result) => {

                if (!err) { // Generate and access token
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);
                    res.status(200).send({
                        user: {
                            username: user.username,
                            email: user.email,
                            photo_url: user.photo_url,

                        },
                        accessToken: accessToken,
                        refreshToken: refreshToken,

                    });
                } else {
                    res.status(400).json({ message: "Authentication Failed: Unauthorized Credentials" });
                }
            })

        } else {
            res.status(400).json({ message: "Authentication Failed: Unauthorized Credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

// Login user using Google Id
router.post('/login/google_auth', async (req, res) => { });

// Verify Token function(Middleware)
const verify = (req, res, next) => {


    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, "myScretKey", (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json("Token is invalid");
            }

            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated!");
    }
}

// Delete a user
router.delete("/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json("User has been deleted");
    } else {
        res.status(403).json("You are not allowed to delete this user");
    }
});

module.exports = router;
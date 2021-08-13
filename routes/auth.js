const users = [
    {
        id: "1",
        username: "john",
        password: "John0908",
        isAdmin: true,
    },
    {
        id: "1",
        username: "jane",
        password: "Jane0908",
        isAdmin: false,
    }
];

let refreshTokens = [];

const secret = "myScreteKey";
const refreshSecret = "MyRefreshSecreteKey";



const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, secret, { expiresIn: "15m", });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, refreshSecret, { expiresIn: "15m", });
}


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.post("/api/refresh", (req, res) => {
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


// creating token on user login
app.post('/api/login', (req, res) => {

    const { username, password } = req.body;
    const user = users.find(u => {
        return u.username === username && u.password === password;
    });
    if (user) {
        // Generate and access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).send({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken
        });
    } else {
        res.status(400).send("Username or password incorrect");
    }
});




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
app.delete("/api/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json("User has been deleted");
    } else {
        res.status(403).json("You are not allowed to delete this user");
    }
});
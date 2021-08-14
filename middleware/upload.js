const multer = require('multer');
const GridFs = require('multer-gridfs-storage');

const storage = new GridFs({
    url: process.env.MONGO_URL,
    options: {
        userNewUrlParser: true,
        userUnifiedTopology: true
    },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-uploads-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "uploads",
            filename: `${Date.now()}-uploads-${file.originalname}`
        }

    }
})

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads');
//     },
//     filename: function (req, file, cd) {
//         cd(null, new Date().toISOString() + file.originalname)
//     }
// });

module.exports = multer({ storage: storage });
const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: function(_, _, cb) { cb(null, 'public/uploads'); },
    filename: function(_, file, cb) {
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, `${uuid.v4()}.${fileExtension}`);
    }
});

module.exports = multer({ storage: storage });
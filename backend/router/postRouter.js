const express = require('express');
const postRouter = new express.Router();
const { createPost } = require('../controller/postController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/post')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".jpg")
    }
});

function fileFilter(req, file, cb) {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error("Not an image"))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

postRouter.post('/', upload.single('post'), createPost);
// postRouter.route('/:post_id').get(getPost).patch(patchPost).delete(deletePost);

module.exports = { postRouter };
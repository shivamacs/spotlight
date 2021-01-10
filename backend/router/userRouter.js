const express = require('express');
const userRouter = new express.Router();
const multer = require('multer');
const { createUser, getUser, patchUser, deleteUser } = require('../controller/userController');
const { handleFollowRequest, acceptFollowRequest, deleteFollowRequest, getAllFollowers } = require('../controller/followerController');
const { handleFollowing, handleUnfollow, getAllFollowing } = require('../controller/followingController');

// profile photo upload functionality
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // store all profile photos in public folder
        cb(null, 'public/user')
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

userRouter.post('/', createUser);
// single multer photo, to be updated in the patchUser function 
userRouter.route('/:user_id').get(getUser).patch(upload.single('user'), patchUser).delete(deleteUser);
// route for follow requests. HTTP request type is POST here as data is to entered in database (creation)

userRouter.post('/follower', handleFollowRequest);
// route to get all followers of a particular user
userRouter.get('/follower/:user_id', getAllFollowers);
userRouter.route('/follower/:user_id/:follower_id').patch(acceptFollowRequest).delete(deleteFollowRequest);

userRouter.post('/following', handleFollowing);
userRouter.get('/following/:user_id', getAllFollowing);
userRouter.delete('/following/:user_id/:following_id', handleUnfollow);

module.exports =  { userRouter };
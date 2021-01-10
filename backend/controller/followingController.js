let userModel = require('../model/userModel');
let followingModel = require('../model/followingModel');

// to follow a user
async function handleFollowing(req, res) {
    let reqObj = req.body;

    try {
        // create new entry in the following table
        await followingModel.follow(reqObj);
        let { username, is_public } = await userModel.getById(reqObj.followingId);

        // if the profile of the user to be followed is public, he/she appears in the following instantly
        if(is_public) {
            res.status(201).json({
                status: "success, POST request for following recieved",
                obj: reqObj,
                message: `you started following ${username}`
            });
        } else { // else, the user to be followed appears in the following only when the he/she accepts the request
            res.status(201).json({
                status: "success, POST request for following recieved",
                obj: reqObj,
                message: `you have requested to follow ${username} - private profile`
            });
        }
    } catch(err) {
        res.status(500).json({
            status: "failed", 
            message: err.message
        });
    }
}

// to unfollow a user
async function handleUnfollow(req, res) {
    let { user_id, following_id } = req.params;

    try {
        // delete entry from the 'following' table
        await followingModel.unfollow(user_id, following_id);
        let { username } = await userModel.getById(following_id);
        
        res.status(200).json({
            status: "success, DELETE request to unfollow recieved",
            message: `you unfollowed ${username}`
        });
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
}

async function getAllFollowing(req, res) {
    let { user_id } = req.params;

    try {
        let allFollowingId = await followingModel.getAllFollowingID(user_id);
        let following = await Promise.all(allFollowingId.map(async function(following_id) {
            let { username, pr_img_url } =  await userModel.getById(following_id);
            return { following_id, username, pr_img_url };
        }));

        res.status(200).json({
            status: "success, GET request to get all following recieved",
            following: following
        });
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
}

module.exports = {
    handleFollowing,
    handleUnfollow,
    getAllFollowing
};
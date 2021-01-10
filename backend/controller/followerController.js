let userModel = require('../model/userModel');
let followerModel = require('../model/followerModel'); 

// handle follow request from one user to another
async function handleFollowRequest(req, res) {
    try {
        // request object of the type of follower mapping table
        let reqObj = req.body;
        let { is_public } = await userModel.getById(reqObj.uid);

        /* Action on follow request depends upon the profile of the user who has been requested.
           If the profile is public, then the follow request will be accepted immediately
           If the profile is pending, then the follow request will be in the pending list of the user who has been
           requested.

           A table 'follower' is a mapping table that stores entries of follow requests and stores the status
           whether the request has been accepted or is pending.
        */

        // if profile is public, follow request must be accepted
        if(is_public) {
            // is_pending is true by default, make it false as the account is public
            reqObj.is_pending = false;
            let mappingObj = await followerModel.createRequest(reqObj);

            return res.status(201).json({
                status: "success, follow request accepted",
                user: mappingObj
            })
        }
        // else for private profile, request is pending
        let mappingObj = await followerModel.createRequest(reqObj);

        return res.status(201).json({
            status: "success, follow request pending",
            user: mappingObj
        })
    } catch(err) {
        res.status(500).json({
            status: "failed", 
            message: err.message
        })
    }
}

// accept follow request
async function acceptFollowRequest(req, res) {
    try {
        // given user ID, follower ID from URL 
        let { user_id, follower_id } = req.params;
        await followerModel.acceptRequest(user_id, follower_id);
        let { username } = await userModel.getById(follower_id);

        res.status(201).json({
            status: "success, follow request accepted",
            message: `${username} started following you.`
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

// delete follow request
async function deleteFollowRequest(req, res) {
    try {
        // given user ID and follower ID from the URL
        let { user_id, follower_id } = req.params;
        await followerModel.deleteRequest(user_id, follower_id);
        let { username } = await userModel.getById(follower_id);

        res.status(201).json({
            status: "success, follow request deleted",
            message: `Request of ${username} deleted`
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

// get all followers of a particular user
async function getAllFollowers(req, res) {
    try {
        // user id of the user whose followers need to be retrieved
        let { user_id } = req.params;
        // get complete data of all followers of the given user
        let followers = await followerModel.getAllFollowersID(user_id);

        // group the data that is relevant to be sent to the client (UI)
        /* Here, Array.map() is used with an async function as we need to call the API to the get the usernames and profile
           pictures of the followers. 
           Since Array.map() is a synchronous function, it behaves in somewhat unexpected way when called with asynchronous
           function. It looks like that when the function already awaits for the data inside the async function, then the final
           result will be mapped as complete data in followersUIData.
           But what actually happening is that the async funfction inside a map() is always returning an array of Promises that
           are to be resolved. That's why, Promise.all() is used to resolve all the promises and properly fill the followersUIData 
           array.
           Although, this would not be the case if we use a for loop to get our data. In that case, await is simply called for each
           iteration.
        */
        let followersUIData = await Promise.all(followers.map(async function(follower) {
            let { followerId, is_pending } = follower;
            let { id, name, username, pr_img_url } = await userModel.getById(followerId);
            return { id, name, username, pr_img_url, is_pending };
        }));

        // console.log(followersUIData);

        res.status(200).json({
            status: "success, all followers retrieved",
            followers: followersUIData
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

module.exports = {
    handleFollowRequest,
    acceptFollowRequest,
    deleteFollowRequest,
    getAllFollowers
}
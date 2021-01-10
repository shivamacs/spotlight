let userModel = require('../model/userModel');

async function createUser(req, res) {
    // try and catch used for database queries
    try {
        let newUser = await userModel.create(req.body);
        
        res.status(201).json({
            success: "success, received POST request from client",
            user: newUser
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

async function getUser(req, res) {
    try {
        let { user_id } = req.params;
        let user = await userModel.getById(user_id);

        if(user === undefined) {
            return res.status(404).json({
                status: "failed",
                error: "user not found"
            })
        }

        res.status(200).json({
            status: "success, received GET request from client",
            user: user
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        })
    }
}

async function patchUser(req, res) {
    try {
        let { user_id } = req.params;
        let toUpdate = req.body;
        let img;

        // if a file is received in the request, then it must be a profile image, so, update the profile image url
        // field in the update object, this will add the location of the profile image in the user table in the database
        if(req.file) {
            img = req.file.filename;
            toUpdate.pr_img_url = "/user/" + img;
        }
    
        await userModel.updateById(user_id, toUpdate);
        const updatedUser = await userModel.getById(user_id);
        
        res.status(200).json({
            status: "success, received PATCH request from client",
            user: updatedUser
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

async function deleteUser(req, res) {
    
    try {
        let { user_id } = req.params;
        
        const deletedUser = await userModel.getById(user_id);
        await userModel.deleteById(user_id);
        
        res.status(200).json({
            status: "success, received DELETE request from client",
            user: deletedUser
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

module.exports = {
    createUser, 
    getUser,
    patchUser,
    deleteUser
};
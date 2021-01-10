let postModel = require('../model/postModel');

async function createPost(req, res) {
   try {
    let newPost = await postModel.create(req.body);

    res.status(201).json({
        status: 'success, POST request for post received',
        post: newPost
    });
   } catch(err) {
    res.status(500).json({
        status: 'failed',
        message: err.message
    });
   }
}

async function getPost(req, res) {    
    try {
        let { post_id } = req.params;
        let post = await postModel.getById(post_id);

        if(post === undefined) {
            return res.status(404).json({
                status: "failed",
                error: "post not found"
            })
        }
    
        res.status(200).json({
            status: "success, received GET request from client",
            post: post
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

async function patchPost(req, res) {
    try {
        let { post_id } = req.params;
        let updateObj = req.body;
    
        await postModel.updateById(post_id, updateObj);
        const updatedPost = await postModel.getById(post_id);
        
        res.status(200).json({
            status: "success, received PATCH request from client",
            post: updatedPost
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

async function deletePost(req, res) {
    try {
        let { post_id } = req.params;
        
        await postModel.deleteById(post_id);
        let deletedPost = await postModel.getById(post_id);
        
        res.status(200).json({
            status: "success, received DELETE request from client",
            post: deletedPost
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

module.exports = {
    createPost, 
    getPost,
    patchPost,
    deletePost
};
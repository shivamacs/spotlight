const { connection } = require('./connection');
// 'follower' is a mapping table where follow requests are stored. The function below communicates with the
// database and stores the data into the follower table.

// create follow request. This function is queried by follower's UI
const createRequest = function(mappingObj) {
    return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO follower SET ?', mappingObj, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(mappingObj);
            }
        })
    })
}

// to accept the request. Function below is queried by user who has been requested
const acceptRequest = function(user_id, follower_id) {
    return new Promise(function(resolve, reject) {
        connection.query(`UPDATE follower SET is_pending=0 WHERE uid="${user_id}" AND followerId="${follower_id}"`, 
            function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result)
                }
        })
    })
}

// to reject the request. Function below is queried by user who has been requested
const deleteRequest = function(user_id, follower_id) {
    return new Promise(function(resolve, reject) {
        connection.query(`DELETE from follower WHERE uid="${user_id}" AND followerId="${follower_id}" AND is_pending=1`, 
            function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result)
                }
        })
    })
}

const getAllFollowersID = function(user_id) {
    return new Promise(function(resolve, reject) {
        connection.query(`SELECT * from follower WHERE uid="${user_id}"`, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });  
    })
}

module.exports = { createRequest, acceptRequest, deleteRequest, getAllFollowersID }; 
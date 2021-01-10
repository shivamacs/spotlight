const  { connection } = require('./connection');

const follow = function(mappingObj) {
    return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO following SET ?', mappingObj, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

const unfollow = function(user_id, following_id) {
    return new Promise(function(resolve, reject) {
        connection.query(`DELETE FROM following WHERE uid="${user_id}" AND followingId="${following_id}"`, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

const getAllFollowingID = function(user_id) {
    return new Promise(function(resolve, reject) {
        connection.query(`SELECT followingId FROM following WHERE uid="${user_id}"`, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports = {
    follow,
    unfollow,
    getAllFollowingID
};
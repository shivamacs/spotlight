let { v4: uuidv4 } = require('uuid')
let { connection } = require('../model/connection');

/* System design ->
   1. High level design
      * Database schema design
      * Measures to reduce latency, redundancy, down time etc.
   
   2. Low level design (Implementation)
      There are some design patterns that can be followed:
      * Singleton design pattern - only one object of a class is allowed
      * Decorator design pattern
      * Factory design pattern - different input => different output, using same function
*/

// We have followed a factory design pattern for queries of different entities like user, post, comments etc through same functions.

/* Factory method is a creational design pattern, i.e., related to object creation. In Factory pattern, we create
   object without exposing the creation logic to client and the client use the same common interface to create new type of object.
   The idea is to use a static member-function (static factory method) which creates & returns instances, hiding the details of class
   modules from user.
  
   A factory pattern is one of the core design principles to create an object, allowing clients to create objects of a library(explained below)
   in a way such that it doesn’t have tight coupling with the class hierarchy of the library.

                            user ------> FACTORY -------> create for createUser, get for getUser, etc.
                            post ------> FACTORY -------> create for createPost, get for getPost, etc.
*/

// The functions below accept a table name exactly same as in database i.e, user, post, comments etc and returns a corresponding function.
// They return a function which are called independently by their respective controllers with required arguments. These inner functions also
// follow closure property of javascript

const createEntity = function(entity) {
    return function(entityObj) {
        entityObj.id = uuidv4();

        if(entity === 'post') {
            let date = new Date();
            entityObj.created_at = date.toISOString().split('T')[0] + " " + date.toTimeString().split(' ')[0];
        }
    
        // return promise to create and store the user in database
        return new Promise(function(resolve, reject) {
            // SET -> this makes the INSERT query shorter as we can directly pass the JSON object that is to be written
            connection.query(`INSERT INTO ${entity} SET ?`, entityObj, function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(entityObj);
                }
            })
        })
    }
}

const getEntityById = function(entity) {
    return function(entityId) { 
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT * FROM ${entity} WHERE id="${entityId}"`, function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            })
        })
    }
}

const updateEntityById = function(entity) {
    return function(entityId, updateObj) {
        let updateStr = "";

        for(let key in updateObj) {
            updateStr += `${key} = "${updateObj[key]}",` 
        }

        updateStr = updateStr.substring(0, updateStr.length - 1);

        return new Promise(function(resolve, reject) {
            connection.query(`UPDATE ${entity} SET ${updateStr} WHERE id="${entityId}"`, function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

const deleteEntityById = function(entity) {
    return function(entityId) {
        return new Promise(function(resolve, reject) {
            connection.query(`DELETE FROM ${entity} WHERE id="${entityId}"`, function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

module.exports = {
    createEntity,
    getEntityById,
    updateEntityById,
    deleteEntityById
};
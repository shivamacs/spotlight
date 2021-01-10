/* This script makes request to the backend with the help of axios - an HTTP client that can make requests from the
   front-end. Features of axios:
   1. Make XMLHttpRequests from the browser
   2. Make http requests from node.js
   3. Supports the Promise API
   4. Intercept request and response
   5. Transform request and response data
   6. Cancel requests
   7. Automatic transforms for JSON data
   8. Client side support for protecting against XSRF
*/
const search = document.querySelector('.search');
const del = document.querySelector('.delete');
const input = document.querySelector('input');
const pEntry = document.querySelector('.p-entry');
const fEntry = document.querySelector('.f-entry');
const rEntry = document.querySelector('.r-entry');

search.addEventListener('click', async function(e) {
    e.preventDefault();
    await showResponse(input.value, 1);
    await populateUserData(input.value);
});

del.addEventListener('click', async function(e) {
    e.preventDefault();
    await showResponse(input.value, 2);
})

// populate the UI with the data recieved as a response from the server
async function showResponse(id, type) {
    // usage of axios
    if(type === 1) {
        let { data } = await axios.get(`api/v1/user/${id}`);
        let user = data.user;
        let { email, username } = user;
        // display data in the html (front-end)
        pEntry.innerHTML = `<p>Email: ${email}</p><p>Username: ${username}</p>`;
    } else if(type == 2) {
        let { data } = await axios.delete(`api/v1/users/${id}`);
        let user = data.user;
        let { email, username } = user;
        pEntry.innerHTML = `<p>User deleted!</p><p>Email: ${email}</p><p>Username: ${username}</p>`;
    }
}

// fill the UI with user data like followers, requests, profile image etc.
async function populateUserData(id) {
    // get all the followers
    let { data } = await axios.get(`api/v1/user/follow/${id}`);
    let followers = data.followers;

    rEntry.innerHTML = "";
    fEntry.innerHTML = "";

    // for each follower, create UI element
    followers.forEach(function(follower) {
        let element = generateElementUI(follower);

        // if follower request is pending then provide the option to accept or delete
        if(follower.is_pending) {
            let accept = document.createElement('button');
            let del = document.createElement('button');
            
            accept.style.margin = '5px';
            accept.innerHTML = 'Accept';

            del.style.margin = '5px';
            del.innerHTML = 'Delete';

            accept.addEventListener('click', function() { 
                acceptAndUpdate(follower, id);
            });
            del.addEventListener('click', function() {
                deleteAndUpdate(follower, id);
            });

            element.appendChild(accept);
            element.appendChild(del);

            rEntry.appendChild(element);
        } else { // else add the element into the followers list
            fEntry.appendChild(element);
        }
    })
}

// generate UI element for a particular follower
function generateElementUI(follower) {
    let element = document.createElement('div');
    let p = document.createElement('p');
    
    element.id = follower.fid;
    element.style.display = 'flex';
    element.style.flexDirection = 'row';
    
    p.style.margin = '5px';
    p.innerHTML = follower.username;

    element.appendChild(p);

    return element;
}

// invoked when user clicks on accept button to accept the follow request
async function acceptAndUpdate(follower, id) {
    await axios.patch(`api/v1/user/follow/${id}/${follower.fid}`);
    rEntry.removeChild(document.getElementById(follower.fid));
    fEntry.appendChild(generateElementUI(follower));
}   

// invoked when user clicks on delete button to delete the follow request
async function deleteAndUpdate(follower, id) {
    await axios.delete(`api/v1/user/follow/${id}/${follower.fid}`);
    rEntry.removeChild(document.getElementById(follower.fid));
}
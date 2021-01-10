import React, { Component } from 'react';
import axios from 'axios';

class ProfileDetails extends Component {
    state = { 
        img_src: "",
        username: "",
        email: "",
        posts: "",
        followers: "",
        following: ""
    }

    async componentDidMount() {
        let { data } = await axios.get('api/v1/user/3db61a8b-b7ff-457b-be5d-a4ef0104b26c');
        let { username, email, pr_img_url } = data.user;
        
        this.setState({
            img_src: pr_img_url,
            username: username,
            email: email
        })

        let followersResponse = await axios.get('api/v1/user/follower/3db61a8b-b7ff-457b-be5d-a4ef0104b26c');
        
        let followers = followersResponse.data.followers.filter((follower) => {
            return follower.is_pending === 0;
        });

        this.setState({
            followers: followers.length
        })
    }

    render() {
        let { img_src, username, email, posts, followers, following } = this.state;

        return ( 
            <div className="profile-details">
                <div className="profile-summary">
                    <h1>Profile</h1>
                    <img src={img_src} alt="profile-img"></img>
                    <div className="username">{username}</div>
                    <div className="email">{email}</div>
                </div>
                <div className="profile-stats">
                    <div className="post-count">
                        <p>{posts}</p>
                        <div>Posts</div>
                    </div>
                    <div className="followers-count">
                        <p>{followers}</p>
                        <div>Followers</div>
                    </div>
                    <div className="following-count">
                        <p>{following}</p>
                        <div>Following</div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default ProfileDetails;
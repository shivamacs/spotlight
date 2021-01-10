import axios from 'axios';
import React, { Component } from 'react';

/* Editing invloves input, select fields etc. These come under the controlled components of React. 
   In HTML, form elements such as <input>, <textarea>, and <select> typically maintain their own state and
   update it based on user input. In React, mutable state is typically kept in the state property of components,
   and only updated with setState().

   We can combine the two by making the React state be the “single source of truth”. Then the React component that
   renders a form also controls what happens in that form on subsequent user input. An input form element whose value 
   is controlled by React in this way is called a “controlled component”.

   The component defined below is used to edit user profile data like name, username, profile image, bio etc. so, we have 
   defined it as a class component instead of function component.
*/
class ProfileSettings extends Component {
    // initially all values are empty
    state = { 
        imgSrc: "",
        name: "",
        email: "",
        username: "",
        bio: "",
        profile: "",
        disabled: true
    }

    /* Refs provide a way to access DOM nodes or React elements created in the render method.
       In the typical React dataflow, props are the only way that parent components interact with their children.
       To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively 
       modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, 
       or it could be a DOM element. For both of these cases, React provides an escape hatch.

       The reference below stores a reference to the <input type="file"> which is used to set profile image. Since, it's value is
       read only, this cannot be handled in the state, therefore, we use a reference to that input file field and update the image
       when click is captured.
    */
    fileInputRef = React.createRef();
    // image object stores the new image. It is declared as a class member as it can be possibly used in other methods.
    imgObj;

    // when image is clicked, it triggers click on input type="file" to choose a new file
    changeImage = () => {
        this.fileInputRef.current.click();
    }

    // update profile image
    setImage = () => {
        // get the new image file as object
        this.imgObj = this.fileInputRef.current.files[0];
        // get the source URL of the new image (URL is a global object in javascript)
        let newImgSrc = URL.createObjectURL(this.imgObj);

        // update image source in state
        this.setState({
            imgSrc: newImgSrc
        });
    }

    // when any user information is changed i.e, name, username, email, bio, profile, this function can
    // handle any type of input (except file), by accessing the name of the input. We just need to define
    // the name of the inputs exactly same as their state names, for the value of multiple inputs to be reflected in
    // the state
    handleChange = (event) => {
        let prop = event.target.name;
        let stateObj = {};

        stateObj[prop] = event.target.value;

        this.setState(stateObj);
    }

    // when the user wants to save changes, the form containing user data is submitted to the backend to reflect changes in 
    // the database 
    handleSubmit = async (event) => {
        // this statement prevents reloading of the complete page as the default behaviour of the HTML form button is to reload
        // the complete data
        event.preventDefault();

        // The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their 
        // values (inbuilt in javascript)
        let formData = new FormData();

        // if a new image has been uploaded, append it to form data
        if(this.imgObj) {
            formData.append("user", this.imgObj);
        }

        // append the current state values of each field
        formData.append("name", this.state.name);
        formData.append("username", this.state.username);
        formData.append("email", this.state.email);
        formData.append("bio", this.state.bio);
        formData.append("is_public", this.state.profile === "public" ? 1 : 0);

        // request the api to update user data by passing the form data
        let { data } = await axios.patch("api/v1/user/146efedd-c2a2-4457-b3e5-f662a43fe877", formData);

        // disable editing until next time
        this.setState({
            disabled: true
        });

        alert(data.status);
    }
    
    // when edit button is clicked, enable editing of user data
    handleEdit = (event) => {
        event.preventDefault();

        this.setState({
            disabled: !this.state.disabled
        });
    }

    // called after render() [inbuilt in react]
    async componentDidMount() {
        // get data of the user from the api
        let { data } = await axios.get("api/v1/user/146efedd-c2a2-4457-b3e5-f662a43fe877");
        let { name, email, username, bio, pr_img_url, is_public } = data.user;

        // update the state (frontend) using the data obtained
        this.setState({
            imgSrc: pr_img_url, name, email, username, bio, profile: is_public ? "public" : "private"
        });
    }

    render() { 
        return ( <div className="container">
                    <h2>User details</h2>
                    {/* profile image */}
                    <div className="img_container">
                        <img src={this.state.imgSrc} alt="" className="profile_img" onClick={this.changeImage}/>
                        <input type="file" name="" id="" ref={this.fileInputRef} onChange={this.setImage} hidden="true"/>
                    </div>
                    {/* user data form */}
                    <form className="info" onSubmit={this.handleSubmit}>
                        {/* name */}
                        <div className="input_container">
                            <label htmlFor="name">Name: </label>
                            <input type="text" name="name" className="user_name" value={this.state.name} disabled={this.state.disabled} onChange={this.handleChange}/>
                        </div>
                        {/* username */}
                        <div className="input_container">
                            <label htmlFor="username">Username: </label>
                            <input type="text" name="username" className="user_handle" value={this.state.username} disabled={this.state.disabled} onChange={this.handleChange}/>
                        </div>
                        {/* email */}
                        <div className="input_container">
                            <label htmlFor="email">Email: </label>
                            <input type="text" name="email" className="user_email" value={this.state.email} disabled={this.state.disabled} onChange={this.handleChange}/>
                        </div>
                        {/* bio */}
                        <div className="input_container">
                            <label htmlFor="bio">Bio: </label>
                            <input type="text" name="bio" className="user_bio" value={this.state.bio} disabled={this.state.disabled} onChange={this.handleChange}/>
                        </div>
                        {/* profile type (public or private) */}
                        <div className="input_container">
                            <label htmlFor="profile_type">Profile: </label>
                            <select name="profile" id="profile_type" value={this.state.profile} onChange={this.handleChange} disabled={this.state.disabled}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <button className="submit_data" onClick={this.handleSubmit}>Submit</button>
                        <button className="edit_data" onClick={this.handleEdit}>Edit</button>
                    </form>
                </div> );
    }
}
 
export default ProfileSettings;
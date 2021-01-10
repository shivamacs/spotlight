import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PostView extends Component {
    state = {  }
    render() { 
        return (<div>
                    <div className="header">
                        <div className="feed"></div>
                        <div className="search"></div>
                        <div className="create_post_btn">
                            <Link to="/profile/create"></Link>
                        </div>
                    </div>
                    <div className="main">
                        
                    </div>

                    <Route path="/profile/create" exact>
                        <div className="create_post">
                            {/* image selection */}
                            {/* textarea */}
                            {/* submit */}
                            {/* query backend */}
                        </div>
                    </Route>
                </div> );
    }
}
 
export default PostView;
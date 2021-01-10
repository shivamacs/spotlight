import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Route, Switch, Redirect } from 'react-router-dom';
import PostView from './components/post/PostView';
import ProfileDetails from './components/user/ProfileDetails';
import ProfileSettings from './components/user/ProfileSettings';
import LoginPage from './components/LoginPage';
import PageNotFound from './components/PageNotFound';

function ProfileMenu(props) {
  let { changeMenu } = props;

  return (
    <div className='profile-menu'>
      <div className='suggestions' onClick={() => changeMenu('suggestions')}>Suggestions</div>
      <div className='requests' onClick={() => changeMenu('requests')}>Requests</div>
      <div className='followers' onClick={() => changeMenu('followers')}>Followers</div>
      <div className='following' onClick={() => changeMenu('following')}>Following</div>
    </div>
  );
}

function Profile(props) {
  return (
    <div className='profile'>
      <ProfileDetails></ProfileDetails>
      <ProfileMenu changeMenu={props.changeMenu}></ProfileMenu>
    </div>
  )
}

function MenuList(props) {
  let { list } = props;

  return (
    <div className='menu-list'>
      {
        list.map((follower) => {
          return (
            <div className='menu-list-item' key={follower.id}>
              <img src={follower.pr_img_url} alt='profile-img'></img>
              <div>{follower.name}</div>
              <div>{follower.username}</div>
            </div>
          )
        })
      }
    </div>
  )
}

class UserView extends Component {
  state = { menu: 'suggestions', list: [] };

  changeMenu = async (category) => {
    if(category === 'requests') {
      let { data } = await axios.get('api/v1/user/follower/3db61a8b-b7ff-457b-be5d-a4ef0104b26c');
      let requests = data.followers.filter(follower => follower.is_pending === 1);

      this.setState({
        menu: category,
        list: requests
      });
    } else if(category === 'followers') {
      let { data } = await axios.get('api/v1/user/follower/3db61a8b-b7ff-457b-be5d-a4ef0104b26c');
      let requests = data.followers.filter(follower => follower.is_pending === 0);

      this.setState({
        menu: category,
        list: requests
      });
    }
  }
  
  render() { 
    return (
        <div className='user-view'>
            <Profile changeMenu={this.changeMenu}></Profile>
            <MenuList list={this.state.list}></MenuList>
        </div>
    );
  }
}

function App() {
  // react routing implemented 
  return (
    <React.Fragment>
      <Switch>
        <Route path="/profile">
          <div className='app'>
            <UserView></UserView>
            <PostView></PostView>
          </div>
        </Route>
        <Route path="/settings">
          <ProfileSettings></ProfileSettings>
        </Route>
        <Route path="/" exact>
          <LoginPage></LoginPage>
        </Route>
        <Redirect from="/login" to="/" exact></Redirect>
        <Route>
          <PageNotFound></PageNotFound>
        </Route>
      </Switch>
    </React.Fragment>
  )
}

export default App;
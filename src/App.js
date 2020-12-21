import './App.css';
import React, { useEffect } from 'react';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import Grid from '@material-ui/core/Grid';

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './Firebase/config'

const Routing = () => {

  const history = useHistory()
  const [user] = useAuthState(auth)

  useEffect(() => {
    
    if(user) {
      history.push('/home')
    }
    else {
      history.push('/signin')
    }

  }, [user])

  return (
    <Switch>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/myprofile">
        <MyProfile />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
    </Switch>
  )

}

function App() {
  const [user] = useAuthState(auth)

  return (
    <BrowserRouter>
      {
        user ?
          <Grid container spacing={3} justify={'center'}>      
              <Grid item xs={12}>
                <NavBar />  
              </Grid>  
          </Grid>
        :
        ''
      }
      <Routing />
    </BrowserRouter>
  );
}

export default App;
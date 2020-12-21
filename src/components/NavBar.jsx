import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeRounded from '@material-ui/icons/HomeRounded';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import { Typography, Grid, Button, BottomNavigation, BottomNavigationAction } from '@material-ui/core';

import { useHistory} from 'react-router-dom'
import {auth} from '../Firebase/config'

const useStyles = makeStyles({
  root: {
    height: '70px'
  },
  vAlign: {
    height: '70px',
    display: 'flex',
    alignItems: 'center'
  }
});

const NavBar = () => {
  const classes = useStyles();
  const [value, setValue] = useState('home');
  const history = useHistory()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container>
        <Grid item xs={3}>
            <BottomNavigation value={value} onChange={handleChange} className={classes.vAlign}>
                <Typography variant="h5">SocioFi</Typography>
            </BottomNavigation>
        </Grid>
        <Grid item xs={6}>
            <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
                <BottomNavigationAction label="Home" value="home" 
                    onClick={() => history.push('/home')} 
                    icon={<HomeRounded />} 
                />
                <BottomNavigationAction label="My Profile" value="myProfile" 
                    onClick={() => history.push('/myprofile')} 
                    icon={<AccountCircle />} 
                />
                <BottomNavigationAction label="Friends" value="friends" 
                    onClick={() => history.push('/home')} 
                    icon={<PeopleAlt />} 
                />
                <BottomNavigationAction label="Favorites" value="favorites" 
                    onClick={() => history.push('/home')}
                    icon={<FavoriteIcon />} 
                />
            </BottomNavigation>   
        </Grid>
        <Grid item xs={3}>
            <BottomNavigation value={value} onChange={handleChange} className={classes.vAlign}>
                <Button variant="outlined" color="secondary" onClick={() => auth.signOut()}>
                    LogOut
                </Button>
            </BottomNavigation>
        </Grid>
    </Grid>
    );
}

export default NavBar
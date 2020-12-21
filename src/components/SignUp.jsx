import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MatLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { Link, useHistory } from 'react-router-dom'
import {auth, firestore} from '../Firebase/config'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MatLink color="inherit" className="router-link" href="https://material-ui.com/">
        SocioFi
      </MatLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = () => {
  const classes = useStyles();

  const history = useHistory();

  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errCode, setErrCode] = useState(null)
  const [errMsg, setErrMsg] = useState(null)
  const [invalidPass, setInvalidPass] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [isSnackOpen, setIsSnackOpen] = useState(false)

  const ResetForm = () => {
      setFname('')
      setLname('')
      setEmail('')
      setPassword('')
  }

  const ResetErrors = () => {
      setErrCode(null)
      setErrMsg(null)
      setInvalidEmail(false)
      setInvalidPass(false)
  }

  const submitForm = async (e) => {
    e.preventDefault()

    ResetErrors()

    auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
            const username = lname.length > 0 ? `${fname} ${lname}` : fname
            console.log(username, email, password)
            res.user.updateProfile({
                displayName: username
            })
            setIsSnackOpen(true)

            firestore.collection('users').doc(auth.currentUser.uid).set({
              username,
              email,
              avatar: auth.currentUser.photoURL
            })
            .then(res => {
              ResetForm()
              history.push('/home')
            })
            .catch(err => console.log(err))

        })
        .catch(error => {
            setErrCode(error.code)
            setErrMsg(error.message)

            if(error.message.toLowerCase().includes('email')) {
                setInvalidEmail(true)
            }
            else if(error.message.toLowerCase().includes('password')) {
                setInvalidPass(true)
            }

            setIsSnackOpen(true)
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={(e) => submitForm(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={invalidEmail}
                helperText={invalidEmail ? errMsg : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={invalidPass}
                helperText={invalidPass ? errMsg : ''}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin" className="router-link">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      {
        errCode ?
          <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {errMsg}
            </Alert>
          </Snackbar>
        :
          <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                This is a success message!
            </Alert>
          </Snackbar>
      }
    </Container>
  );
}

export default SignUp;
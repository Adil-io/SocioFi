import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiLink from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Avatar, Button, Box, Grid, TextField, 
  Snackbar, Dialog, Divider, DialogTitle, 
  DialogContentText, DialogContent, DialogActions, 
  Container, Typography  } from '@material-ui/core';
import GoogleButton from 'react-google-button'
import { Link, useHistory } from 'react-router-dom'
import firebase from 'firebase/app'
import { auth, firestore } from '../Firebase/config';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" className="router-link" href="https://material-ui.com/">
        SocioFi
      </MuiLink>{' '}
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  gBtn: {
    margin: theme.spacing(1, 0, 2, 9)
  }
}));

const SignIn = () => {
  const history = useHistory();  
  const classes = useStyles();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errCode, setErrCode] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  const [invalidPass, setInvalidPass] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [isSnackOpen, setIsSnackOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [changeDialog, setChangeDialog] = useState(false)

  const ResetForm = () => {
    setEmail('')
    setPassword('')
  }

  const ResetErrors = () => {
    setErrCode(null)
    setErrMsg(null)
    setInvalidEmail(false)
    setInvalidPass(false)
  }

  const submitForm = (e) => {
    e.preventDefault()

    ResetErrors()

    auth.signInWithEmailAndPassword(email, password)
        .then(res => {
            setIsSnackOpen(true)
            ResetForm()
            history.push('/home')
        })
        .catch(error => {
            setErrCode(true)
            setErrMsg(error.message)

            if(error.message.toLowerCase().includes('email')) {
                setInvalidEmail(true)
            }
            else if(error.message.toLowerCase().includes('password')) {
                setInvalidPass(true)
            }
            else {
                setInvalidEmail(true)
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
    setIsDialogOpen(false);
  };

  const handlePasswordReset = () => {
    setIsDialogOpen(true)
  }

  const sendPwdResetLink = () => {
    auth.sendPasswordResetEmail(email).then(res => {
        setChangeDialog(true)
    })
    .catch(error => {
        console.log(error)
        setErrCode(true)
        setErrMsg(error.message)
    })
  }

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider).then(res => {
      setIsSnackOpen(true)
      const user = auth.currentUser
      firestore.collection('users').doc(user.uid).set({
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL
      })
      .then(res => {
        ResetForm()
        history.push('/home')
      })
      .catch(err => console.log(err))
    })
    .catch(error => {
      setErrCode(true)
      setErrMsg(error.message)

      if(error.message.toLowerCase().includes('email')) {
        setInvalidEmail(true)
      }
      else if(error.message.toLowerCase().includes('password')) {
        setInvalidPass(true)
      }
      else {
        setInvalidEmail(true)
        setInvalidPass(true)
      }
      setIsSnackOpen(true)
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={(e) => submitForm(e)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            error={invalidEmail}
            helperText={invalidEmail ? errMsg : ''}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            error={invalidPass}
            helperText={invalidPass ? errMsg : ''}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Divider />
          <GoogleButton
            type="light"
            className={classes.gBtn}
            onClick={() => loginWithGoogle()}
          />
          <Grid container>
            <Grid item xs>
              <MuiLink href="#" onClick={() => handlePasswordReset()} className="router-link">
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <Link to="/signup" className="router-link">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
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
      <Dialog open={isDialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reset Password Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
                !changeDialog ?
                'Enter Email to Reset Password'
                 :
                 `Reset link successfully sent to ${email}`
            }
          </DialogContentText>
          {
              !changeDialog ?
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                error={errCode}
                helperText={errMsg ? errMsg : ''}
              />
                : ''
          }
        </DialogContent>
        <DialogActions>
          {
              !changeDialog ?
              <>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={sendPwdResetLink} color="primary">
                    Send Password Reset Link
                </Button>
              </>
              :
                <Button onClick={() => {setIsDialogOpen(false); setEmail('')}} color="primary">
                    Confirm
                </Button>
          }
        </DialogActions>
      </Dialog>
      <Snackbar open={auth.currentUser ? true : false} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            Successfully Logged In!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SignIn;
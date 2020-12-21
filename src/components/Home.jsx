import React, {useEffect, useState} from 'react'
import ReactPlayer from 'react-player'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseRounded from '@material-ui/icons/CloseRounded';
import Image from '@material-ui/icons/Image';
import Movie from '@material-ui/icons/Movie';
import Mood from '@material-ui/icons/Mood';
import Input from '@material-ui/core/Input';
import Modal from '@material-ui/core/Modal';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';
import Delete from '@material-ui/icons/Delete';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Divider } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';

import firebase from 'firebase/app'
import {auth, firestore, storage} from '../Firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const useStyles = makeStyles((theme) => ({
    root: {
        width: 800
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        objectFit: 'cover'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    postDiv: {
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '50px',
        cursor: 'pointer'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPost: {
        width: 550,
        minHeight: 450,
        outline: 'none',
        padding: 8
    },
    input: {
        border: "#ffffff"
    },
    imageProgress: {
        position: 'absolute',
        top: 11,
        left: 370,
        zIndex: 1
    },
    videoProgress: {
        position: 'absolute',
        top: 11,
        left: 418,
        zIndex: 1
    },
    inputImageRoot: {
        position: 'relative'
    },
    inputImageMedia: {
        minHeight: 0,
        paddingTop: '56.25%',
        zIndex:1
    },
    cancelBtn: {
        position: 'absolute',
        zIndex: 2,
        left: 455
    },
    postTypography: {
        whiteSpace: 'pre-line',
        fontSize: '2.5ch'
    }
}));

const Home = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const [postBody, setPostBody] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [tempPid, setTempPid] = useState('');
    const [imageProgressValue, setImageProgressValue] = useState(0);
    const [videoProgressValue, setVideoProgressValue] = useState(0);
    const [imageSuccess, setImageSuccess] = useState(false);
    const [movieSuccess, setMovieSuccess] = useState(false);
    const [isSnackOpen, setIsSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('')

    const postsRef = firestore.collection('posts')
    const query = postsRef.orderBy('createdAt', 'desc')
    const [posts] = useCollectionData(query, {idField: 'id'})
    const [user] = useAuthState(auth)

    useEffect(() => {
        console.log('Use Effect')
        console.log('Posts', posts)
    }, [posts])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleMenuOpen = (event, pid) => {
        setTempPid(pid)
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setTempPid('')
        setAnchorEl(null);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setIsSnackOpen(false);
    };

    const createPost = () => {
        const postRef = firestore.collection('posts')

        postRef.add({
            content: postBody,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            postedBy: {
                userId: user.uid,
                username: user.displayName,
                email: user.email,
                avatar: user.photoURL
            },
            imageUrl: currentImageUrl,
            videoUrl: currentVideoUrl
        })
        .then(() => {
            setPostBody('')
            setImageSuccess(false)
            setMovieSuccess(false)
            setImageProgressValue(0)
            setVideoProgressValue(0)
            handleClose()
            setCurrentImageUrl(null)
            setCurrentVideoUrl(null)
            setSnackMessage('Post Created Successfully!')
            setIsSnackOpen(true)
        })
        .catch(err => console.log('Error Posting', err))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        const imagesRef = storage.ref(`postImages/${file.name}-${moment().unix()}`)
        const task = imagesRef.put(file)

        task.on('state_changed', (snapshot) => {
            let percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            setImageProgressValue(percentage)
        }, (err)=>{
            console.log(err)
        }, ()=>{
            imagesRef.getDownloadURL().then(image => {
                setImageSuccess(true)
                setSnackMessage('Image Uploaded Successfully!')
                setIsSnackOpen(true)
                setCurrentImageUrl(image)
            })
            .catch(err => console.log('Failed to get Image url'))
        })
    }

    const removeImage = () => {
        const imageRef = storage.refFromURL(currentImageUrl)
        imageRef.delete().then(()=>{
            setCurrentImageUrl(null)
            setImageProgressValue(0)
            setImageSuccess(false)
        })
        .catch(err => console.log('Error deleting Image', err))
    }

    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        console.log(file)
        const videoRef = storage.ref(`postVideos/${file.name}-${moment().unix()}`)
        const task = videoRef.put(file)

        task.on('state_changed', (snapshot) => {
            let percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            setVideoProgressValue(percentage)
        }, (err)=>{
            console.log(err)
        }, ()=>{
            videoRef.getDownloadURL().then(video => {
                setMovieSuccess(true)
                setSnackMessage('Video Uploaded Successfully!')
                setIsSnackOpen(true)
                setCurrentVideoUrl(video)
            })
            .catch(err => console.log('Failed to get Video url'))
        })
    }

    const removeVideo = () => {
        const videoRef = storage.refFromURL(currentVideoUrl)
        videoRef.delete().then(()=>{
            setCurrentVideoUrl(null)
            setVideoProgressValue(0)
            setMovieSuccess(false)
        })
        .catch(err => console.log('Error deleting Video', err))
    }

    const deletePost = () => {
        console.log(tempPid)
        postsRef.doc(tempPid).get()
        .then(post => {
            postsRef.doc(tempPid).delete().then(() => {
                if (post.data().imageUrl) {
                    const imageRef = storage.refFromURL(post.data().imageUrl)            
                    imageRef.delete().then(()=>{
                        setSnackMessage('Post with Image Deleted Successfully!')
                        setIsSnackOpen(true)
                    })
                    .catch(err => console.log('Error deleting Image', err))
                }
                if (post.data().videoUrl) {
                    const videoRef = storage.refFromURL(post.data().videoUrl)            
                    videoRef.delete().then(()=>{
                        setSnackMessage('Post with Video Deleted Successfully!')
                        setIsSnackOpen(true)
                    })
                    .catch(err => console.log('Error deleting Image', err))
                }
                else {
                    setSnackMessage('Post Deleted Successfully!')
                    setIsSnackOpen(true)
                }
            })
            .catch(err => console.log('Error deleting Post', err))    
        })
        .catch(err => console.log(err))

        handleMenuClose()
    }

    const formatDate = (date) => {
        // return moment(date).format('DD MMM YYYY')
        return moment(date).calendar()
    }

    return (
            <Grid container spacing={3} direction="column" justify="center" alignItems="center">
                <Grid item xs={6}>
                    <Card style={{
                        width: '47vw',
                        maxWidth: '47vw'
                    }}>
                        <CardHeader
                            avatar={
                                user &&
                                <Avatar aria-label="avatar" className={classes.avatar} src={user ? user.photoURL : ''} />
                            }
                            title={
                                <div className={classes.postDiv} onClick={handleOpen}>
                                    <Typography 
                                        noWrap
                                        variant="body1"
                                        style={{marginLeft: 5}}
                                    >
                                        {
                                            postBody === '' ? "What's on your mind today!" : postBody
                                        }
                                        
                                    </Typography>
                                </div>
                            }
                        />
                    </Card>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={postBody === '' ? handleClose : ''}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <Card className={classes.createPost}>
                                <CardHeader
                                    action={
                                        <IconButton onClick={handleClose} aria-label="closeModal">
                                            <CloseRounded />
                                        </IconButton>
                                    }
                                    title={
                                        <>
                                            <Typography variant="h5"
                                                style={{marginBottom: 10}}
                                            >
                                                Create Post
                                            </Typography>
                                            <Divider />
                                        </>
                                    }
                                    style={{textAlign: 'center'}}
                                />
                                <CardContent style={{textAlign: 'left'}}>
                                    <Grid container alignItems="flex-start" alignContent="center">
                                        <Grid item xs={12} alignItems="center" style={{display: 'flex'}}>
                                            <Avatar aria-label="Avatar" className={classes.avatar} src={user ? user.photoURL : ''} />
                                            <Typography style={{display: 'inline-block', marginLeft: 10}} 
                                                variant="body1">
                                                    {user ? user.displayName : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Input 
                                                autoFocus
                                                disableUnderline
                                                multiline
                                                fullWidth
                                                style={{fontSize: 20, marginTop: 10}}
                                                rows={7}
                                                rowsMax={12}
                                                placeholder={`What's on your mind, ${user ? user.displayName : ''}?`}
                                                value={postBody}
                                                onChange={(e) => setPostBody(e.target.value)}
                                            />
                                            {
                                                currentImageUrl && 
                                                <Card className={classes.inputImageRoot}>
                                                    <CardActionArea>
                                                        <IconButton onClick={removeImage} className={classes.cancelBtn}>
                                                            <Cancel style={{color: 'white'}} />
                                                        </IconButton>
                                                        <CardMedia
                                                            className={classes.inputImageMedia}
                                                            image={currentImageUrl}
                                                        />
                                                    </CardActionArea>
                                                </Card>
                                            }
                                            {    
                                                currentVideoUrl && 
                                                <Card className={classes.inputImageRoot}>
                                                    <CardActionArea>
                                                        <IconButton onClick={removeVideo} className={classes.cancelBtn}>
                                                            <Cancel style={{color: 'white'}} />
                                                        </IconButton>
                                                        <CardMedia
                                                            component="video"
                                                            controls
                                                            image={currentVideoUrl}
                                                        />
                                                    </CardActionArea>
                                                </Card>
                                            }       
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardHeader
                                                    style={
                                                        {position: 'relative'}
                                                    } 
                                                    title={
                                                        <Typography variant="body1">
                                                            Add to your Post
                                                        </Typography>
                                                    }
                                                    action={<>
                                                        <input style={{display: 'none'}} accept="image/*" 
                                                            id="image-button-file" type="file" 
                                                            onChange={handleImageUpload}    
                                                        />
                                                        {
                                                            imageSuccess ?
                                                                <IconButton style={{backgroundColor: 'transparent'}} disableRipple disableTouchRipple>
                                                                    <CheckCircleRounded 
                                                                        style={{
                                                                                fontSize: 37,
                                                                                color: '#00a152'
                                                                        }} 
                                                                    />
                                                                </IconButton> 
                                                            :<>
                                                            <label htmlFor="image-button-file">
                                                                <IconButton
                                                                    style={{zIndex: 2}} 
                                                                    aria-label="image" component="span">
                                                                    <Image />
                                                                </IconButton>
                                                            </label>
                                                            {
                                                                imageProgressValue > 0 && <CircularProgress variant="indeterminate" 
                                                                    className={classes.imageProgress} 
                                                                />
                                                            }                                                        
                                                        </>}

                                                        <input style={{display: 'none'}} accept="video/*" 
                                                            id="video-button-file" type="file" 
                                                            onChange={handleVideoUpload}    
                                                        />
                                                        {
                                                            movieSuccess ?
                                                                <IconButton style={{backgroundColor: 'transparent'}} disableRipple disableTouchRipple>
                                                                    <CheckCircleRounded 
                                                                        style={{
                                                                                fontSize: 37,
                                                                                color: '#00a152'
                                                                        }} 
                                                                    />
                                                                </IconButton> 
                                                            :<>
                                                            <label htmlFor="video-button-file">
                                                                <IconButton
                                                                    style={{zIndex: 2}} 
                                                                    aria-label="video" component="span">
                                                                    <Movie />
                                                                </IconButton>
                                                            </label>
                                                            {
                                                                videoProgressValue > 0 && <CircularProgress variant="indeterminate" 
                                                                    className={classes.videoProgress} 
                                                                />
                                                            }                                                        
                                                        </>}
                                                                                                      
                                                        <IconButton onClick={handleClose} aria-label="mood">
                                                            <Mood />
                                                        </IconButton>
                                                    </>}
                                                />
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button fullWidth 
                                                variant="contained" color="primary"
                                                disabled={postBody === '' ? true : false}
                                                onClick={() => createPost()}
                                            >
                                                POST
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </Fade>
                    </Modal>
                </Grid>
                {
                    posts && posts.map(post => 
                        <Grid item xs={6} key={post.id}>
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                    <Avatar aria-label="avatar" className={classes.avatar} src={post.postedBy.avatar} />
                                    }
                                    action={                                 
                                        <IconButton aria-label="settings" 
                                            onClick={(e) => handleMenuOpen(e, post.id)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={post.postedBy.username}
                                    subheader={post.createdAt ? formatDate(post.createdAt.toDate()) : ''}
                                    style={{textAlign: 'left'}}
                                />
                                {
                                    post.imageUrl && 
                                    <CardMedia
                                        className={classes.media}
                                        image={post.imageUrl}
                                    />
                                }
                                {
                                    //console.log('Image UUURL', post.videoUrl)
                                    post.videoUrl &&
                                    <CardMedia
                                        component="video"
                                        controls
                                        image={post.videoUrl}
                                        style={{outline: 'none'}}
                                    />
                                }
                                <CardContent style={{textAlign: 'left'}}>
                                    <Typography variant="subtitle1" className={classes.postTypography} color="textPrimary" component="p">
                                        {post.content}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={() => handleExpandClick()}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Method:</Typography>
                                            <Typography paragraph>
                                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                                minutes.
                                            </Typography>
                                        <Typography paragraph>
                                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                                minutes more. (Discard any mussels that don’t open.)
                                        </Typography>
                                        <Typography>
                                            Set aside off of the heat to let rest for 10 minutes, and then serve.
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid> 
                    )
                }
                <Menu
                    id="post-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={openMenu}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>
                        <Edit style={{marginRight: 15}} /> Edit Post                                                        
                    </MenuItem>
                    <MenuItem onClick={deletePost}>                                            
                        <Delete style={{marginRight: 15}} /> Delete Post                                            
                    </MenuItem>
                </Menu>

                <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
                    <Alert onClose={handleSnackClose} severity="success">
                        {snackMessage}
                    </Alert>
                </Snackbar>

            </Grid>
    )
}

export default Home;
import React, { useEffect } from 'react'

import firebase from 'firebase/app'
import {auth, firestore} from '../Firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const MyProfile = () => {
    const postsRef = firestore.collection('posts')
    const [user] = useAuthState(auth)
    const query = postsRef.where('postedBy.userId', '==', user.uid)
    const [myPosts] = useCollectionData(query, {idField: 'id'})

    useEffect(() => {
        console.log(myPosts)
    }, [myPosts])

    return (
        <h1>My Profile Page</h1>
    )
}

export default MyProfile
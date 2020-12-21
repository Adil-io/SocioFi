import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'

firebase.initializeApp({
    apiKey: "AIzaSyBSGU82g-dC1Fyi97dmNG7wyk8TyoaMLxU",
    authDomain: "sociofi.firebaseapp.com",
    projectId: "sociofi",
    storageBucket: "sociofi.appspot.com",
    messagingSenderId: "709960199367",
    appId: "1:709960199367:web:846fb51a802cf94b1a22e2",
    measurementId: "G-6MGFWJXP5D"
})
  
const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()
const storage = firebase.storage()

export { auth, firestore, storage }
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB_cD7jTA4NuG0mMKeHsJlY9lBfElKHdWA",
    authDomain: "dnd-character-creator-4f39b.firebaseapp.com",
    projectId: "dnd-character-creator-4f39b",
    storageBucket: "dnd-character-creator-4f39b.firebasestorage.app",
    messagingSenderId: "428339560101",
    appId: "1:428339560101:web:3031100a258b658cc9d74c",
    measurementId: "G-PENVZK9V8N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, signInAnonymously };
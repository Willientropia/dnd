// Simple Firebase connection test
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB_cD7jTA4NuG0mMKeHsJlY9lBfElKHdWA",
    authDomain: "dnd-character-creator-4f39b.firebaseapp.com",
    projectId: "dnd-character-creator-4f39b",
    storageBucket: "dnd-character-creator-4f39b.firebasestorage.app",
    messagingSenderId: "428339560101",
    appId: "1:428339560101:web:3031100a258b658cc9d74c",
    measurementId: "G-PENVZK9V8N"
};

async function testFirebase() {
    try {
        console.log('🔄 Initializing Firebase...');
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        console.log('🔄 Attempting anonymous sign in...');
        const userCredential = await signInAnonymously(auth);
        console.log('✅ Anonymous sign in successful:', userCredential.user.uid);
        console.log('🔒 User is anonymous:', userCredential.user.isAnonymous);

        console.log('🔄 Attempting to write to Firestore...');
        const testDoc = doc(db, "test", "connection");
        await setDoc(testDoc, { 
            timestamp: new Date(), 
            test: true,
            userId: userCredential.user.uid 
        });
        console.log('✅ Firestore write successful');

        console.log('🔄 Attempting to read from Firestore...');
        const docSnap = await getDoc(testDoc);
        if (docSnap.exists()) {
            console.log('✅ Firestore read successful:', docSnap.data());
        } else {
            console.log('❌ Document does not exist');
        }

        console.log('✅ All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 'auth/operation-not-allowed') {
            console.error('💡 Solução: Habilite login anônimo no Firebase Console');
            console.error('   1. Vá para Firebase Console > Authentication > Sign-in method');
            console.error('   2. Habilite "Anonymous" provider');
        }
    }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
    // Browser environment
    testFirebase();
} else {
    console.log('Este teste deve ser executado no navegador');
}

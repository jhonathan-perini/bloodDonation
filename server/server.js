
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import app from "./app.js";

const PORT = 8000



const firebaseConfig = {
    apiKey: "AIzaSyCaU_BRuRwS2U4vHJdcKLctSfNUQn4PWfA",
    authDomain: "blood-donation-4e57e.firebaseapp.com",
    projectId: "blood-donation-4e57e",
    storageBucket: "blood-donation-4e57e.appspot.com",
    messagingSenderId: "48994401410",
    appId: "1:48994401410:web:3e8858a2e76e1113c3889b"
};

export const FIREBASE = initializeApp(firebaseConfig);
export const auth = getAuth(FIREBASE);

app.listen(PORT, () => {
    console.log(`Server Connected`)
})
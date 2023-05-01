// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaU_BRuRwS2U4vHJdcKLctSfNUQn4PWfA",
    authDomain: "blood-donation-4e57e.firebaseapp.com",
    projectId: "blood-donation-4e57e",
    storageBucket: "blood-donation-4e57e.appspot.com",
    messagingSenderId: "48994401410",
    appId: "1:48994401410:web:3e8858a2e76e1113c3889b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});


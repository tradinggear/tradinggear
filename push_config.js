// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-oRTijXPXQCCnbK4MIMCl3saCLNUtGmA",
  authDomain: "tradinggearsub.firebaseapp.com",
  projectId: "tradinggearsub",
  storageBucket: "tradinggearsub.firebasestorage.app",
  messagingSenderId: "801432625850",
  appId: "1:801432625850:web:732d870f6fb6c015c61883",
  measurementId: "G-56L7LG4HM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
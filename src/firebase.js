// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9t-w6kTIpfKYGY3rO-TKhzsKLpR_vthc",
  authDomain: "tallermanillas-8e61e.firebaseapp.com",
  projectId: "tallermanillas-8e61e",
  storageBucket: "tallermanillas-8e61e.appspot.com",
  messagingSenderId: "1078686043875",
  appId: "1:1078686043875:web:0f62de966bd18cbc893fd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

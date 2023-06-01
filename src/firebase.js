// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuEdpbYBwN1geHtysGJvxaKrB2N-F3wuk",
  authDomain: "manillas-xyz.firebaseapp.com",
  projectId: "manillas-xyz",
  storageBucket: "manillas-xyz.appspot.com",
  messagingSenderId: "843903600313",
  appId: "1:843903600313:web:cadba0e58aacf9e083bd68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, signInWithCustomToken, signOut,sendPasswordResetEmail } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBge3IzjR7epJvQz9OxL2XEYyi56pe0R-M",
//   authDomain: "fir-auth-fb9f6.firebaseapp.com",
//   databaseURL: "https://fir-auth-fb9f6.firebaseio.com",
//   projectId: "fir-auth-fb9f6",
//   storageBucket: "fir-auth-fb9f6.firebasestorage.app",
//   messagingSenderId: "696130458976",
//   appId: "1:696130458976:web:97bd2a2d88781309447a05"
// };


// coderdesy profile

// const firebaseConfig = {
//   apiKey: "AIzaSyAVOCDQu0kU2yOkCDnMwRgHrvU0V80yVH0",
//   authDomain: "profile-gen.firebaseapp.com",
//   projectId: "profile-gen",
//   storageBucket: "profile-gen.firebasestorage.app",
//   messagingSenderId: "355885050989",
//   appId: "1:355885050989:web:c571b5ebb08dfea7e56364"
// };





// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVOCDQu0kU2yOkCDnMwRgHrvU0V80yVH0",
  authDomain: "profile-gen.firebaseapp.com",
  projectId: "profile-gen",
  storageBucket: "profile-gen.firebasestorage.app",
  messagingSenderId: "355885050989",
  appId: "1:355885050989:web:18dd3c532f63937ee56364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
export { auth, setPersistence, browserLocalPersistence, signInWithCustomToken, signOut ,sendPasswordResetEmail};
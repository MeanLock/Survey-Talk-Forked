import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkJXZ7DjrFLwRnrIhZ1aCZUl8M9InyWL8",
  authDomain: "surveytalk-461a0.firebaseapp.com",
  projectId: "surveytalk-461a0",
  storageBucket: "surveytalk-461a0.firebasestorage.app",
  messagingSenderId: "626948565393",
  appId: "1:626948565393:web:b19e18867ff7d7955e9230",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

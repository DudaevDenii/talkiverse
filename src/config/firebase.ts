import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBxfpfvHFKr3fyS7BTeYHxm8bG4pqydgrU",
  authDomain: "talkiverse-742ed.firebaseapp.com",
  projectId: "talkiverse-742ed",
  storageBucket: "talkiverse-742ed.appspot.com",
  messagingSenderId: "1026669446670",
  appId: "1:1026669446670:web:22b12b730d507920589e5f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

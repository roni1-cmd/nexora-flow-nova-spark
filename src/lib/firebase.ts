
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCB1DwFSwQLDOlUFtWQtUvqOWPnI1HrP5E",
  authDomain: "messenger-7c40c.firebaseapp.com",
  projectId: "messenger-7c40c",
  storageBucket: "messenger-7c40c.firebasestorage.app",
  messagingSenderId: "435817942279",
  appId: "1:435817942279:web:36b3f65e6358d8aa0a49a2",
  measurementId: "G-HJ094HC4F2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

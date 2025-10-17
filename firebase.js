import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD45Ue380ZQYj3voO8FarEc2oTvc1Rvxq4",
  authDomain: "kavachasafe.firebaseapp.com",
  projectId: "kavachasafe",
  storageBucket: "kavachasafe.appspot.com", // ✅ fixed
  messagingSenderId: "509303270038",
  appId: "1:509303270038:web:7343962aa05b1dfd84b0b7",
  measurementId: "G-ZCGHN29T7J",
};

// Initialize Firebase app safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, firebaseConfig };

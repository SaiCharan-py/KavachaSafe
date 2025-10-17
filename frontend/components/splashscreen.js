import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { getToken } from "../auth";


const SplashScreen = ({ navigation }) => {
useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔍 Step 1: Try to get token from SecureStore
        const token = await SecureStore.getItemAsync("authToken");

        setTimeout(() => {
          if (token) {
            // ✅ If token exists → go Home
            navigation.replace("Home");
          } else {
            // ❌ No token → go Login
            navigation.replace("Login");
          }
        }, 3200); // 3.2s splash
      } catch (error) {
        console.log("Auth check error:", error);
        navigation.replace("Login");
      }
    };

    checkAuth();
  }, []);


  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/logo.png")} // 👉 replace with your KavachaSafe logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text style={styles.title}>KavachaSafe</Text>
      <Text style={styles.tagline}>Your AI-Powered Personal Safety</Text>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="#FF3B30" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // clean background
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 320,
    height: 200,
    marginBotom: 20,
    backgroundColor: "#fff",
    
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF3B30", // safety red
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});

export default SplashScreen;

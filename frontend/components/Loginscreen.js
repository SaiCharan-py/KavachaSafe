import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async () => {
    if (!email) return alert("Please enter your email");

    try {
      const res = await fetch("http://192.168.1.4:5000/api/auth/send-otp", {
        // 👆 use 10.0.2.2 if running Android Emulator
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // ✅ send email instead of phone
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully!");
        navigation.navigate("Otp", { email });
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to KavachaSafe</Text>
      <Text style={styles.subtitle}>Your safety, our priority</Text>

      <Text style={styles.orText}>Sign in with email</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleEmailSubmit}>
          <Text style={styles.appText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  orText: { textAlign: "center", color: "#888", marginVertical: 10 },
  inputWrapper: { marginTop: 10 },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    backgroundColor: "#fafafa",
    fontSize: 16,
    marginBottom: 12,
  },
  sendBtn: {
    borderRadius: 12,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  appText: { fontSize: 15, fontWeight: "600", color: "#fff" },
});

export default LoginScreen;

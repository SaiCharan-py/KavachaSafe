import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Use 10.0.2.2 for Android Emulator, otherwise use localhost (or local IP)

const OtpVerification = ({ route, navigation }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email } = route.params;

  const handleVerifyOtp = async () => {
    // FIX A: Ensure function returns after setting error on invalid OTP
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return; 
    }
    
    setLoading(true);
    setError("");
    
    try {
      // FIX B: Using the dynamic BASE_URL
      const res = await fetch("http://192.168.1.4:5000/api/auth/send-otp", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Use replace to prevent user from navigating back to OTP screen
        navigation.replace("Home"); 
      } else {
        // Clear OTP field on failure for better UX
        setOtp(""); 
        setError(data.message || "Invalid OTP. Please try again");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Could not connect to server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent an OTP to {email}. Enter it below to verify your number.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
          editable={!loading} // Disable input while loading
        />

        <TouchableOpacity
          style={[styles.button, (loading || otp.length !== 6) && { opacity: 0.7 }]} // Disable button if OTP is incomplete
          onPress={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Didn't receive OTP? You can resend it from the previous screen.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#555", marginTop: 6, marginBottom: 16 },
  errorText: {
    backgroundColor: "#ffe8e8",
    padding: 10,
    borderRadius: 8,
    color: "#b00020",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  helpText: { textAlign: "center", color: "#666", marginTop: 12, fontSize: 12 },
});

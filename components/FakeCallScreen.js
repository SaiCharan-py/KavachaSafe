import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Vibration,
  Dimensions,
  Animated,
  Easing,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";

const { height } = Dimensions.get("window");

export default function FakeCallScreen({ navigation }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const callerName = "Safety Contact";

  useEffect(() => {
    // 🔊 Play ringtone
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/ringtone.mp3"), // ensure this file exists
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    };
    playSound();

    // 📳 Vibrate repeatedly
    Vibration.vibrate([1000, 1000], true);

    // 💫 Animate caller image (pulse)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      Vibration.cancel();
      if (soundRef.current) soundRef.current.stopAsync();
    };
  }, []);

  const handleAnswer = () => {
    Vibration.cancel();
    if (soundRef.current) soundRef.current.stopAsync();
    Alert.alert("Fake Call", "You answered the fake call!");
    navigation.goBack();
  };

  const handleReject = () => {
    Vibration.cancel();
    if (soundRef.current) soundRef.current.stopAsync();
    navigation.goBack();
  };

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <LinearGradient colors={["#000", "#1a1a1a"]} style={styles.callContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={[styles.callerImageWrapper, pulseStyle]}>
        <Image
          source={require("../assets/caller.png")} // use your caller image
          style={styles.callerImage}
        />
      </Animated.View>

      <Text style={styles.callerName}>{callerName}</Text>
      <Text style={styles.callStatus}>Incoming Call...</Text>

      <View style={styles.callButtonRow}>
        <TouchableOpacity
          style={[styles.callButton, styles.rejectButton]}
          onPress={handleReject}
        >
          <Ionicons name="close" size={36} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callButton, styles.answerButton]}
          onPress={handleAnswer}
        >
          <Ionicons
            name="call"
            size={36}
            color="#FFF"
            style={{ transform: [{ rotate: "-135deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  callContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#000",
    paddingVertical: height * 0.1,
  },
  callerImageWrapper: {
    borderRadius: 100,
    overflow: "hidden",
  },
  callerImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    resizeMode: "cover",
  },
  callerName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 10,
  },
  callStatus: {
    fontSize: 18,
    color: "#AAA",
    marginBottom: 20,
  },
  callButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: { backgroundColor: "#FF3B30" },
  answerButton: { backgroundColor: "#34C759" },
});

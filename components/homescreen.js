import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as SMS from "expo-sms";
import call from "react-native-phone-call";
import { removeToken } from "../auth";
import { Audio } from "expo-av";
import * as SecureStore from "expo-secure-store"; 
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import { SOS_CONTACTS} from "../config";



const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const circle = [
    { id: "1", name: "Mom", online: true },
    { id: "2", name: "Dad", online: false },
    { id: "3", name: "Bestie", online: true },
    { id: "4", name: "Friend1", online: true },
    { id: "5", name: "Friend2", online: false },
  ];
  const tips = [
  { id: '1', text: "Share your location if walking alone at night" },
  { id: '2', text: "Check-in with your safety circle every 2 hours" },
  { id: '3', text: "Stay close to well-lit streets" },
  { id: '4', text: "Nearby police station: 1.2 km" },
];
    const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [safestRoute, setSafestRoute] = useState(null);
  const [helpPlaces, setHelpPlaces] = useState([]);
  const [sirenOn, setSirenOn] = useState(false);
  const [recording, setRecording] = useState(null);




  const handleLogout = async () => {
  await SecureStore.deleteItemAsync('user_token');
  navigation.replace('Login');
};



  // ✅ SOS Function
  const handleSOS = async () => {
    try {
      // 1. Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      const { latitude, longitude } = loc.coords;

      // Send to backend
      await fetch("http://192.168.1.6:5000/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, latitude, longitude }),
      });

      // Send SMS to circle
      if (await SMS.isAvailableAsync()) {
        await SMS.sendSMSAsync(
          SOS_CONTACTS,
          `🚨 SOS! I need help. Location: https://maps.google.com/?q=${latitude},${longitude}`
        );
      }


      // 2. Emergency Call
      call({ number: "112", prompt: false });

    // Start recording
const { granted } = await Audio.requestPermissionsAsync();
if (granted) {
  const rec = new Audio.Recording();
  await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await rec.startAsync();
  setRecording(rec);
}

// Vibrate for siren alert
Vibration.vibrate([500, 500, 500], true); // pattern, repeat = true

      // 4. Loud Siren + Flashlight
      setSirenOn(true);
      Vibration.vibrate([500, 500, 500], true);

      Alert.alert("🚨 SOS Triggered", "Your safety circle & helpline have been alerted.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong with SOS.");
    }
  };

      // ✅ Shake to activate SOS
  useEffect(() => {
    Accelerometer.setUpdateInterval(300);
    const subscription = Accelerometer.addListener(accel => {
      const totalForce = Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z);
      if (totalForce > 3.2) { // Shake threshold
        handleSOS();
      }
    });
    return () => subscription && subscription.remove();
  }, []);

  

  // ✅ Nearby Help Network (Police, Hospitals, etc.)
  const fetchNearbyHelp = async () => {
    if (!location) return;
    const { latitude, longitude } = location;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=police&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await res.json();
      setHelpPlaces(data.results);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (location) fetchNearbyHelp();
  }, [location]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}> 🤖 Hi Sai Charan</Text>
        <TouchableOpacity 
  style={styles.settingsBtn}
  onPress={() => navigation.navigate("Settings")}
>
  <Ionicons name="settings-outline" size={28} color="#555" />
</TouchableOpacity>

        </View>
       
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SOS Button */}
        <View style={styles.middleSection}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn}>
              <Ionicons name="share-outline" size={26} color="#FF3B30" />
              <Text style={styles.quickText}>Share Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn}>
              <Ionicons name="checkmark-circle-outline" size={26} color="#34C759" />
              <Text style={styles.quickText}>Check-In Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn}
            onPress={() => navigation.navigate("FakeCall")}>
              
              <Ionicons name="call-outline" size={26} color="#007AFF" />
              <Text style={styles.quickText}>Fake Call</Text>
            </TouchableOpacity>
          </View>
        </View>
         {location ? (
      
  <MapView
    style={styles.map}
    provider={PROVIDER_GOOGLE}
    initialRegion={{
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    showsUserLocation={true}
  >
   
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      title="You"
    />
  </MapView>
  
) : (
  <Text style={{ marginTop: 20, color: "red" }}>
    Fetching your location...
  </Text>
)}

       
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
  {tips.map((tip, index) => (
    <View key={index} style={styles.tipCard}>
      <Ionicons name="alert-circle-outline" size={22} color="#FF3B30" />
      <Text style={styles.tipText}>{tip.text}</Text>
    </View>
  ))}
</ScrollView>
</ScrollView>

      {/* Footer - pinned at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity 
        onPress={() => navigation.navigate("ChatBot")} 
       style={styles.footerItem}
      >
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="#555" />
       <Text style={styles.footerText}>Chat</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} 
        onPress={() => navigation.navigate("Contacts")}>
          <Ionicons name="person-add-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Add Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="alert-circle-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Helplines")}>
          <Ionicons name="call-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Helplines</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topSection: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 24, fontWeight: "700", color: "#111" },
  settingsBtn: { padding: 6 },
  locationError: { marginTop: 8, color: "#FF3B30", fontWeight: "500" },

  scrollContent: { paddingBottom: 120, alignItems: "center" },

  middleSection: { alignItems: "center", marginTop: 16 },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosText: { fontSize: 42, color: "#fff", fontWeight: "900" },
  quickActions: { flexDirection: "row", justifyContent: "space-around", width: width * 0.9 },
  quickBtn: { alignItems: "center", marginHorizontal: 8 },
  quickText: { fontSize: 13, marginTop: 4, color: "#444" },

  statusPanel: { paddingVertical: 14, marginTop: 20 },
  panelTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, paddingLeft: 12 },
  statusCard: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 2,
  },
  circleName: { fontSize: 14, marginTop: 6, fontWeight: "600" },
  status: { fontSize: 12, marginTop: 2 },

  aiCard: {
    width: width * 0.9,
    backgroundColor: "#FFF8E1",
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  aiText: { fontSize: 14, marginLeft: 10, color: "#333", flexShrink: 1 },


   tipCard: {
    backgroundColor: "#fff",
    width: 220,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: { fontSize: 14, fontWeight: "500", marginTop: 4 },

  map: {
  width: width * 0.9,
  height: 220, // adjust this to fit nicely in between
  borderRadius: 12,
  marginVertical: 16,
},
  

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 6,
  },
  footerItem: { alignItems: "center" },
  footerText: { fontSize: 12, color: "#555", marginTop: 4 },
});

export default HomeScreen;

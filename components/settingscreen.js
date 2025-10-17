import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [sosAlerts, setSosAlerts] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [aiTips, setAiTips] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);

  const navigation = useNavigation();


    const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user_token');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="person-circle-outline" size={28} color="#FF3B30" />
            <Text style={styles.rowText}>Sai Charan</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="call-outline" size={28} color="#007AFF" />
            <Text style={styles.rowText}></Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Account & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="lock-closed-outline" size={24} color="#FF9500" />
            <Text style={styles.rowText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.rowText}>Logout</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>SOS Alerts</Text>
            <Switch
              value={sosAlerts}
              onValueChange={setSosAlerts}
              trackColor={{ false: "#ccc", true: "#FF3B30" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Friend Activity</Text>
            <Switch
              value={friendActivity}
              onValueChange={setFriendActivity}
              trackColor={{ false: "#ccc", true: "#34C759" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Emergency & SOS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency & SOS</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Auto Share Location</Text>
            <Switch
              value={autoLocation}
              onValueChange={setAutoLocation}
              trackColor={{ false: "#ccc", true: "#007AFF" }}
              thumbColor="#fff"
            />
          </View>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Trusted Contacts</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* AI Tips & Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Tips & Suggestions</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Receive Safety Tips</Text>
            <Switch
              value={aiTips}
              onValueChange={setAiTips}
              trackColor={{ false: "#ccc", true: "#FF9500" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Version 1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Terms & Privacy</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Support</Text>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: {
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rowText: { fontSize: 14, color: "#333" },
});

export default SettingsScreen;

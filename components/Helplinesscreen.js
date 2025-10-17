import React from "react";
import { View, Text, TouchableOpacity, Linking, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelplinesScreen() {
  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>📞 Helplines</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Emergency */}
        <Text style={styles.sectionTitle}>🚨 Emergency</Text>

        <TouchableOpacity style={[styles.card, styles.red]} onPress={() => callNumber("100")}>
          <Text style={styles.cardText}>Police - 100</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.red]} onPress={() => callNumber("108")}>
          <Text style={styles.cardText}>Ambulance - 108</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.red]} onPress={() => callNumber("101")}>
          <Text style={styles.cardText}>Fire - 101</Text>
        </TouchableOpacity>

        {/* Specialized */}
        <Text style={styles.sectionTitle}>👩‍🦰 Women & Children</Text>

        <TouchableOpacity style={[styles.card, styles.pink]} onPress={() => callNumber("1091")}>
          <Text style={styles.cardText}>Women Helpline - 1091</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.blue]} onPress={() => callNumber("1098")}>
          <Text style={styles.cardText}>Child Helpline - 1098</Text>
        </TouchableOpacity>

        {/* Support */}
        <Text style={styles.sectionTitle}>🛡️ App Support</Text>

        <TouchableOpacity style={[styles.card, styles.green]} onPress={() => callNumber("1800123456")}>
          <Text style={styles.cardText}>App Helpdesk</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerText: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#1F2937" },
  body: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#374151" },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: { fontSize: 16, fontWeight: "500", color: "#1F2937" },
  red: { backgroundColor: "#FECACA" },
  pink: { backgroundColor: "#FBCFE8" },
  blue: { backgroundColor: "#BFDBFE" },
  green: { backgroundColor: "#BBF7D0" },
});

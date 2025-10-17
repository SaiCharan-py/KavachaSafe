import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send, renderScrollToBottom } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// 🔹 Rule-based safety knowledge
const safetyRules = {
  "sos": "🚨 The SOS button will alert your safety circle immediately.",
  "nearest police": "👮 The nearest police station is 2 km away near XYZ road.",
  "check in": "✅ The Check-In Safe button will notify your circle you’re safe.",
  "fake call": "📞 Fake Call will simulate a call to help you get out of unsafe situations.",
  "tips": "💡 Always stay on well-lit roads, share your location, and keep emergency numbers handy."
};

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // First welcome message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "👋 Hi! I’m your KavachaSafe Assistant.\n How may I help you ...",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "KavachaBot",
          avatar: "https://i.ibb.co/vjY0xZr/bot-avatar.png", // 🔹 replace with your bot logo
        },
      },
    ]);
  }, []);

  // Handle user messages
  const onSend = useCallback((newMessages = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    const userMsg = newMessages[0].text.toLowerCase();

    let botReply = "❓ I’m not sure about that. Try asking about SOS, police, check in, or tips.";
    for (const key in safetyRules) {
      if (userMsg.includes(key)) {
        botReply = safetyRules[key];
        break;
      }
    }

    // Show typing effect
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(),
            text: botReply,
            createdAt: new Date(),
            user: { 
              _id: 2, 
              name: "KavachaBot",
              avatar: "https://i.ibb.co/vjY0xZr/bot-avatar.png"
            },
          },
        ])
      );
    }, 1000);
  }, []);

  const renderScrollToBottom = () => {
    return (
        <View style={styles.scrollToBottomContainer}>
            <Icon name="chevron-down-circle" size={30} color="#0D47A1"  />
        </View>
    );
};

  const renderSend = (props) => {
  return (
    <Send {...props}>
      <View style={styles.sendIconContainer}>
        <Icon name="send" size={24} color="#0D47A1" /> 
      </View>
    </Send>
  );
};

  // Customize chat bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#2E7D32", padding: 5,}, // user msg = green
        left: { backgroundColor: "#1565C0", padding: 5, marginLeft :-45, marginBottom:25 }, // bot msg = blue
      }}
      textStyle={{
        right: { color: "#fff" },
        left: { color: "#fff" },
      }}
    />
  );

  // Custom header for chatbot
  const renderHeader = () => (
    <View style={styles.header}>
      <Icon name="shield-check" size={24} color="#fff" />
      <Text style={styles.headerTitle}>KavachaSafe Assistant</Text>
      <TouchableOpacity style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
      {renderHeader()}

      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: 1, name: "You", avatar: "https://i.ibb.co/bQ6H0jv/user.png" }}
        renderBubble={renderBubble}
        placeholder="Type your safety question..."
        isTyping={isTyping}
        alwaysShowSend
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{ borderTopWidth: 1, borderColor: "#ddd", padding: 5 }}
          />
        )}
        renderSend={renderSend}

       scrollToBottom
      scrollToBottomComponent={renderScrollToBottom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0D47A1",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sosButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sosText: { color: "#fff", fontWeight: "bold" },
  floatingSOS: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 50,
    elevation: 5,
  },
   sendIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    height: "100%",
  },
});

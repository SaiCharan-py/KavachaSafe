import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../kavachasafe/components/splashscreen";
import LoginScreen from "./components/Loginscreen";
import OtpVerification from "./components/otpverification";
import HomeScreen from "./components/homescreen";
import SettingsScreen from "./components/settingscreen";
import 'react-native-gesture-handler';
import HelplinesScreen from './components/Helplinesscreen';
import ChatBotScreen from './components/chatscreen';
import ContactsPickerScreen from './components/AddtoContacts';
import FakeCallScreen from './components/FakeCallScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Otp" component={OtpVerification} />
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Settings" component={SettingsScreen} />
         <Stack.Screen name="Helplines" component={HelplinesScreen} />
         <Stack.Screen name = "ChatBot" component={ChatBotScreen} />
         <Stack.Screen name = "Contacts" component={ContactsPickerScreen}/>
         <Stack.Screen name = "FakeCall" component={FakeCallScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

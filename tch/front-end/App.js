import React, { useState, useEffect } from "react";
import AnimatedSplash from "react-native-animated-splash-screen";
import { StyleSheet, Animated, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ContactScreen from "./screens/ContactScreen";
import ChannelScreen from "./screens/ChannelScreen";
import SettingsScreen from "./screens/ProfilScreen";
import ChatScreen from "./screens/ChatScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FlashMessage from "react-native-flash-message";

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyleInterpolator: forFade,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '0F1828#' },
          title: 'Home',
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerStyleInterpolator: forFade,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '0F1828#' },
          title: 'Connexion',
          tabBarStyle: { display: "none" },
          headerStyle: { backgroundColor: '#0F1828' },
          headerShown: false,
        }}
      />
      < Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerStyleInterpolator: forFade,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#0F1828' },
          title: 'Inscription',
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />

    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};

const Stack = createNativeStackNavigator();
const StackNavigate = () => {

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      console.log('Status :', isLoggedIn);
    } else {
      setIsLoggedIn(false);
      console.log('Status :', isLoggedIn);
    }
  }
  useEffect(() => {
    checkToken();
  }, []);
  setTimeout(() => {
    setLoading(true);
  }, 2000);
  <StatusBar backgroundColor="#0F1828" barStyle="light-content" />

  return (

    <AnimatedSplash
      translucent={true}
      isLoaded={loading}
      logoImage={require("./assets/NewLogo.png")}
      backgroundColor={"#0F1828"}
      logoHeight={350}
      logoWidth={350}
    >
      <Stack.Navigator
        options={{
          activeTintColor: '#FF6B6B',
          activeBackgroundColor: '#0F1828',
          inactiveBackgroundColor: '#0F1828',
        }}
      >
        <Stack.Screen
        
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        < Stack.Screen
          name="Channel"
          component={ChannelScreen}
          options={{
            tabBarLabel: 'Channel',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={30} />
            ),
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#0F1828' },
            headerShown: false,

          }}
        />
        < Stack.Screen
          name="Contacts"
          component={ContactScreen}
          options={{
            tabBarLabel: 'Contacts',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="contacts" color={color} size={30} />
            ),
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#0F1828' },
            headerShown: true,
          }}
        />
        
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="message" color={color} size={30} />
            ),
            tabBarBadge: 3,
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#0F1828' },
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Profil"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={30} />
            ),
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#0F1828' },
          }}
        />
      </Stack.Navigator>
    </AnimatedSplash>

  );
}
export default function App() {
  return (
    <NavigationContainer>
      <StackNavigate />
      <FlashMessage position="top" />
    </NavigationContainer >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1828',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

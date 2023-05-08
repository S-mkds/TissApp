import { StyleSheet, Text, View } from 'react-native';
import Home from "./screens/Home";
import Profil from "./screens/Profil";
import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Register from './screens/Register';
import Contact from './screens/Contact';
import Chanel from './screens/Chanel';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Tab = createMaterialTopTabNavigator();
const TabNavigate = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Profil') {
            iconName = focused ? 'ios-person' : 'ios-person';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles';
          }
          else if (route.name === 'Contact') {
            iconName = focused ? 'ios-people' : 'ios-people';
          }
          else if (route.name === 'Chanel') {
            iconName = focused ? 'ios-chatbox-ellipses-sharp' : 'ios-chatbox-ellipses-sharp';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#0F1828' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
      })}>
      <Tab.Screen name="Chat" component={Chat}/>
      <Tab.Screen name="Chanel" component={Chanel}/>
      <Tab.Screen name="Contact" component={Contact} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
const StackNavigate = () => {
  console.log(StackNavigate);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkToken = async() => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(true);
      console.log('Status : user connecté');
    } else {
      setIsLoggedIn(false);
      console.log('Status : user non connecté');
    }
  }
  useEffect(() => {
    checkToken();
  }, []);
  return (
<Stack.Navigator
  initialRouteName={isLoggedIn ? 'Profil' : 'Home'}
  component={TabNavigate}
  screenOptions={{
    headerStyle: {
      backgroundColor: '#0F1828',
    },
    cardStyle: {
      backgroundColor: '#0F1828',
    },
    headerTintColor: '#fff',
  }}
>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Connexion' }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: 'Inscription' }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'TissApp ' }}
      />

      <Tab.Screen name="Profil" component={TabNavigate} options={{ title: 'TissApp ', headerShown: true, headerLeft: null }} />      
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigate/>
    </NavigationContainer >
  );
}
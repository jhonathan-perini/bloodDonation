import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Authentication from "./Authentication";
import {auth} from "./firebaseConfig";
import {NativeRouter, Route, Routes} from "react-router-native";
import {useState} from "react";
import Home from "./MainScreen";
import Auth from "./Authentication"
import {ActivityIndicator} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import {Tabs2} from './TabNavigator'
import {useFonts} from "expo-font";
import Profile from "./Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null)
  const [fontsLoaded] = useFonts({
    'SFLight': require('./assets/fonts/SF-Pro-Rounded-Light.otf'),
    'SFRegular': require('./assets/fonts/SF-Pro-Rounded-Regular.otf'),
  });
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  });


  return (
          <NavigationContainer>
            <Stack.Navigator   >
              {user ?  ( <Stack.Screen name="Home" options={{headerShown: false}}  component={Tabs2} /> ):
                  <Stack.Screen  name="Auth" options={{headerShown: false, ...TransitionPresets.ModalTransition}} component={Auth} />
              }
              <Stack.Screen name="Profile"  options={{headerShown: true, title: 'Meus dados'}}  component={Profile} />
            </Stack.Navigator>
          </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

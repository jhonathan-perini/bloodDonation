import { StyleSheet} from 'react-native';
import {auth} from "./firebaseConfig";
import React, {useState} from "react";
import Auth from "./Authentication"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import {Tabs2} from './TabNavigator'
import {useFonts} from "expo-font";
import Profile from "./Profile";
import PartnerRegistration from "./PartnerRegistrarion";
import {QueryClient, QueryClientProvider} from "react-query";
import Information from "./Information";
<<<<<<< HEAD
import Notifications from "./Notifications";


import {StatusBar} from "expo-status-bar";



const queryClient = new QueryClient()
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null)
  const [fontsLoaded] = useFonts({
    'SFLight': require('./assets/fonts/SF-Pro-Rounded-Light.otf'),
    'SFRegular': require('./assets/fonts/SF-Pro-Rounded-Regular.otf'),
    'SFBold': require('./assets/fonts/SF-Pro-Rounded-Bold.otf'),
  });

  if(!fontsLoaded){
    return null
  }
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  });


  return (
      <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator   >
              {user ?  <><Stack.Screen name="Home" options={{headerShown: false}}  component={Tabs2} />
                    <Stack.Screen name="Profile"  options={{headerShown: true, title: 'Meus dados'}}  component={Profile} />
                    <Stack.Screen name="Information"  options={{headerShown: true, title: 'Informações'}}  component={Information} />
                    <Stack.Screen name="Notifications"  options={{headerShown: true, title: ' Notificações'}}  component={Notifications} />
                  </>:
                  <>
                    <Stack.Screen  name="Auth" options={{headerShown: false, ...TransitionPresets.ModalTransition}} component={Auth} />
                    <Stack.Screen  name="AuthPartner" options={{headerTransparent: true, headerTitle: ''}} component={PartnerRegistration} />

                  </>
              }

            </Stack.Navigator>
          </NavigationContainer>
        <StatusBar style="dark"/>
      </QueryClientProvider>
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

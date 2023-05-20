import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from './MainScreen'
import Settings from "./Settings";
import Locals from "./Locals";
import {useQuery} from "react-query";
import {auth} from "./firebaseConfig";
import api from "./api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Button} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Donations from "./Donations";
import BeforeScheduleInfo from "./BeforeScheduleInfo";
import DonationSchedule from "./DonationSchedule";
import BloodSupply from "./BloodSupply";
import React, {createContext, useContext, useState} from "react";
import Overlay from "./Overlay";
const Tab = createBottomTabNavigator();
const Stack2 = createNativeStackNavigator();
const Stack3 = createNativeStackNavigator();
import TabContext from "./TabContext";
export function Home2() {
    return (
        <Stack2.Navigator>
            <Stack2.Screen name="Donations" options={{headerLargeTitle: true, headerShadowVisible: false, headerTitle: 'Minhas doações'}} component={Donations} />
            <Stack2.Screen name="BeforeScheduleInfo" options={{headerShown: true}}  component={BeforeScheduleInfo} />
            <Stack2.Screen name="DonationLocal" options={{headerShown: true}}  component={Locals} />
            <Stack2.Screen name="DonationSchedule" options={{headerShown: true}}  component={DonationSchedule} />
        </Stack2.Navigator>
    );
}

export function Home4() {
    return (
        <Stack2.Navigator>

            <Stack2.Screen name="DonationLocal" options={{headerShown: true}}  component={Locals} />
            <Stack2.Screen name="DonationSchedule" options={{headerShown: true}}  component={DonationSchedule} />
        </Stack2.Navigator>
    );
}

export function Home3() {
    return (
        <Stack2.Navigator>
            <Stack2.Screen name="BloodSupply"  component={BloodSupply} />
            <Stack2.Screen name="BeforeScheduleInfo" options={{headerShown: true}}  component={BeforeScheduleInfo} />
            <Stack2.Screen name="DonationSchedule" options={{headerShown: true}}  component={DonationSchedule} />
        </Stack2.Navigator>
    );
}



export function Tabs2(){
    const [overlay,setOverlay] = useState()
    const {data: user} = useQuery(["USER_TYPE"], async() => {
        if(auth.currentUser?.email) {

            const response = await api.get(`/find-user/${auth.currentUser.email}` )

            return response.data
        }
    })
    return (
        <TabContext.Provider value={{overlay, setOverlay}} >
            {overlay &&  <Overlay/>}
        <Tab.Navigator>
            <Tab.Screen name="Start" component={Home} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            <Tab.Screen name={user?.cnpj ? "Estoque" : "Doações"}  component={user?.cnpj ? Home3 : Home2} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name={user?.cnpj ? "blood-bag" : "hand-heart-outline"} color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato',
                headerShown: false,

            }} />
            {!user?.cnpj && <Tab.Screen name="Hemocentros" component={Home4} options={{
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="office-building-marker" color={color} size={size}/>
                ),
                tabBarActiveTintColor: 'tomato',
                headerShown: false
            }}/>}
            <Tab.Screen name="Configurações"  component={Settings} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato',
                tabBarBadge: 3,

            }} />
        </Tab.Navigator>
        </TabContext.Provider>
    )
}


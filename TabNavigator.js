import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from './MainScreen'
import Settings from "./Settings";
import Locals from "./Locals";
import {useQuery, useQueryClient} from "react-query";
import {auth} from "./firebaseConfig";
import api from "./api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Button} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Donations from "./Donations";
import BeforeScheduleInfo from "./BeforeScheduleInfo";
import DonationSchedule from "./DonationSchedule";
import BloodSupply from "./BloodSupply";
import React, {createContext, useContext, useEffect, useState} from "react";
import Overlay from "./Overlay";
const Tab = createBottomTabNavigator();
const Stack2 = createNativeStackNavigator();
const Stack3 = createNativeStackNavigator();
import TabContext from "./TabContext";
import ScheduleConfirmation from "./ScheduleConfirmation";
import Notifications from "./Notifications";
import ScheduleLocal from "./ScheduleLocal";
export function Home2() {

    return (
        <Stack2.Navigator>
            <Stack2.Screen name="Donations" options={{headerLargeTitle: true, headerShadowVisible: false, headerTitle: 'Minhas doações'}} component={Donations} />
            <Stack2.Screen name="BeforeScheduleInfo" options={{headerShown: true, headerTitle: 'Informações'}}  component={BeforeScheduleInfo} />
            <Stack2.Screen name="DonationLocal" options={{headerShown: true, headerTitle: 'Postos de coleta'}}  component={Locals} />
            <Stack2.Screen name="DonationSchedule" options={{headerShown: true, headerTitle: 'Agendamento'}}  component={DonationSchedule} />
            <Stack2.Screen name="ScheduleConfirmation" options={{headerShown: true, headerBackVisible: false, headerTitle: 'Confirmação'}}  component={ScheduleConfirmation} />
        </Stack2.Navigator>
    );
}

export function Home4() {
    return (
        <Stack2.Navigator>

            <Stack2.Screen name="DonationLocal" options={{headerShown: true, headerTitle: 'Postos de coleta'}}  component={Locals} />
            <Stack2.Screen name="DonationSchedule" options={{headerShown: true, headerTitle: 'Agendamento'}}  component={DonationSchedule} />
        </Stack2.Navigator>
    );
}

export function Home3() {
    return (
        <Stack2.Navigator>
            <Stack2.Screen name="BloodSupply" options={{headerTitle: 'Bolsas'}}  component={BloodSupply} />


        </Stack2.Navigator>
    );
}



export function Tabs2({navigation}){
    const [overlay,setOverlay] = useState()


    const {data: user} = useQuery(["USER_TYPE"], async() => {

        if(auth.currentUser?.email) {

            const response = await api.get(`/find-user/${auth.currentUser.email}` )


            return response.data
        }
    })
    const {data: userNotification} = useQuery(['USER_NOTIFICATIONS2', auth.currentUser, user], async () => {
        if(auth.currentUser){
            const response = await api.get(`/notifications/${user?.email}`)
            const number = response.data?.filter((item) => item?.status === 'unseen')

            return number?.length || null

        }
    })


    return (
        <TabContext.Provider value={{overlay, setOverlay}} >
            {overlay &&  <Overlay/>}
        <Tab.Navigator>
            {user?.cnpj && <Tab.Screen name="Agendamentos" component={ScheduleLocal} options={{
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="calendar" color={color} size={size}/>
                ),
                tabBarActiveTintColor: 'tomato',
                headerShown: true,


            }}/>}
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
            {!user?.cnpj &&<Tab.Screen name="Notificações"  component={Notifications} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="bell" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato',
                tabBarBadge: userNotification || null,

            }} />}
            <Tab.Screen name="Configurações"  component={Settings} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato',


            }} />

        </Tab.Navigator>
        </TabContext.Provider>
    )
}


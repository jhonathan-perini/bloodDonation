import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from './MainScreen'
import Settings from "./Settings";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from "react-native";
import Donations from './Donations'
import Locals from "./Locals";
const Tab = createBottomTabNavigator();


export function Tabs2(){
    return (
        <Tab.Navigator>
            <Tab.Screen name="Start" component={Home} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            <Tab.Screen name="Doações" component={Donations} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="blood-bag" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            <Tab.Screen name="Hemocentros" component={Locals} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="office-building-marker" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            <Tab.Screen name="Configurações"  component={Settings} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato',
                tabBarBadge: 3,

            }} />
        </Tab.Navigator>
    )
}


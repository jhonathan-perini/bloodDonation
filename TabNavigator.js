import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from './MainScreen'
import Settings from "./Settings";
import Donations from './Donations'
import Locals from "./Locals";
import {useQuery} from "react-query";
import {auth} from "./firebaseConfig";
import api from "./api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Tab = createBottomTabNavigator();


export function Tabs2(){

    const {data: user} = useQuery(["USER_TYPE"], async() => {
        if(auth.currentUser?.email) {
            const response = await api.get(`/find-user/${auth.currentUser.email}` )
            return response.data
        }
    })
    return (
        <Tab.Navigator>
            <Tab.Screen name="Start" component={Home} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            <Tab.Screen name={user?.cnpj ? "Estoque" : "Doações"} component={Donations} options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name={user?.cnpj ? "blood-bag" : "hand-heart-outline"} color={color} size={size} />
                ),
                tabBarActiveTintColor: 'tomato'
            }} />
            {!user?.cnpj && <Tab.Screen name="Hemocentros" component={Locals} options={{
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="office-building-marker" color={color} size={size}/>
                ),
                tabBarActiveTintColor: 'tomato'
            }}/>}
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


import {Text, TouchableOpacity, View} from "react-native";



export default function Donations({navigation}){

    return(
        <View>

        <TouchableOpacity
onPress={() => navigation.navigate('BeforeScheduleInfo')}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',

                borderRadius: 10,
                padding: 10
            }}>
            <Text >Agendar doação</Text>
        </TouchableOpacity>
        </View>
    )
}
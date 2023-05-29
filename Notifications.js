
import {Text, SafeAreaView} from 'react-native'
export default function Notifications(){
    return(
        <SafeAreaView style={{height: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', color: '#808080'}}>Você não possui nenhuma notificação</Text>
        </SafeAreaView>
    )
}
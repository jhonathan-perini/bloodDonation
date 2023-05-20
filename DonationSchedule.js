import {Text, SafeAreaView} from 'react-native'
export default function DonationSchedule({route, navigation}){
    const {local} = route.params
    return (
        <SafeAreaView>
            <Text>{JSON.stringify(local)}</Text>
        </SafeAreaView>

    )

}
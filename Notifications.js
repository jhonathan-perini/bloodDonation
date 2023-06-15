
import {Text, SafeAreaView, FlatList, ScrollView, View, TouchableOpacity, Image} from 'react-native'
import {useMutation, useQuery, useQueryClient} from "react-query";
import React, {useState} from "react";
import api from "./api";
import {auth} from "./firebaseConfig";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {retrieveDate} from "./Locals";
import {stylesAuth} from "./Authentication";
import DeleteDonationModal from "./DeleteDonationModal";
import cry from "./assets/information.png";
import cry2 from "./assets/information2.png";
export default function Notifications({navigation}){
    const [user, setUser] = useState('')
    const client = useQueryClient()
    const [refresh, setRefresh] = useState(false)
    const {data: userNotification} = useQuery(['USER_NOTIFICATIONS', refresh, user, auth.currentUser], async () => {
        if(auth.currentUser){
        const response = await api.get(`/notifications/${user?.email}`)

            setRefresh(false)
           if(response.data?.length === 0) return []
            return response.data.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.dateCreated.split('.')[0]) - new Date(a.dateCreated.split('.')[0]);
            })

            }
    })
    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused


            setUser(client.getQueryData('USER_TYPE'))


        });
    }, [navigation]);
    const changeStatus = useMutation( async (args) => {
        if(auth.currentUser){
            return await api.patch(`/notifications/${user?.email}+${args}`)
        }
    }, {
        onSuccess: async() => {
            await client.invalidateQueries('USER_NOTIFICATIONS')
            await client.invalidateQueries('USER_NOTIFICATIONS2')
        }
    })
function changeNotificationStatus(id){
    changeStatus.mutate(id)
}
    return(
        <SafeAreaView style={{height: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center'}}>
            {userNotification?.length > 0  &&   <FlatList
                contentContainerStyle={{alignSelf: 'flex-start', width: '100%'}}
                onRefresh={() => setRefresh(true)}
                refreshing={refresh}
                data={userNotification}
                renderItem={({item, index}) => {
                    return <ScrollView>
                        <View key={item._id}>
                            <TouchableOpacity style={{

                                backgroundColor: item?.status === 'unseen' ? 'rgba(178,178,178,0.28)' : '#FFF',

                                padding: 10,
                                paddingVertical: 30,
                                width: '100%',
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(24,24,24,0.19)',
                                alignSelf: 'center'
                            }} onPress={() => changeNotificationStatus(item._id)}>
                                {item?.type ?<>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                    <Image source={item?.status === 'unseen' ? cry : cry2} style={{width: 25, height: 25, marginRight: 10}}/>
                                        <View>
                                    <Text style={{fontFamily: 'SFBold'}}>{item.message.split('!')[0]} </Text>
                                    <Text style={{fontFamily: 'SFRegular'}}>{item.message.split('!')[1]}</Text>
                                    </View>
                                    </View>
                                    </> :<>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                    <Image source={item?.status === 'unseen' ? cry : cry2} style={{width: 25, height: 25, marginRight: 10}}/>
                                    <View>
                                    <Text style={{fontFamily: 'SFRegular'}}>Sua doação precisou ser cancelada. Sentimos
                                    muito!</Text>
                                    <Text style={{fontFamily: 'SFBold', marginTop: 4}}>{item.local}, {new Date(item.date).toLocaleDateString('pt-BR')} - {item.hour}:00h</Text>
                                    </View>
                                </View></>}
                            </TouchableOpacity>
                        </View>


                    </ScrollView>
                }}

            />}
            {userNotification?.length <= 0 &&<Text style={{textAlign: 'center', color: '#808080'}}>Você não possui nenhuma notificação</Text>}
        </SafeAreaView>
    )
}
import {
    Button,
    FlatList,
    Keyboard,
    Pressable,
    Text,
    View,
    TouchableWithoutFeedback,
    SafeAreaView,
    TouchableOpacity, Image, ScrollView
} from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, {useEffect, useState} from "react";
import {TextInput} from "react-native-paper";
import {useMutation, useQuery, useQueryClient} from "react-query";
import api from "./api";
import {auth} from "./firebaseConfig";
import {styles as ST} from "./StorageModal";
import {stylesAuth} from "./Authentication";
import cry from "./assets/cry.png";
import {retrieveDate} from "./Locals";
import DeleteDonationModal from "./DeleteDonationModal";
import {donationStyle} from "./Donations";

export default function ScheduleLocal({navigation}){
    const [refresh, setRefresh] = useState(false)
    const [user, setUser] = useState('')
    const [screen, setScreen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [delItem, setdelItem] = useState(null)
    const [confirmDel, setConfirmDel] = useState(null)
    const client = useQueryClient()
    const {data: donations} = useQuery(['USER_DONATIONS', screen, user, refresh], async() => {
        if(auth.currentUser){
            const response = await api.get(`/donations-local/${user?.email}`)
            setRefresh(false)
            return response.data
        }
    })
    function defineDel(item){
        setDeleting(true)
        setdelItem(item)
    }
    const delSchedule = useMutation(async(args) => {
        return await api.patch(`/del-schedule/${args.cnpj}`, args)
    }, {
        onSuccess: async () => {
            alert('Agendamento excluído com sucesso.')

            await api.post(`/notify`, {email: delItem.user.email, message: 'Seu agendamento precisou ser desmarcado. Sentimos muito!', date: delItem.date, hour: delItem.hour, local: delItem.local.name})
            await client.invalidateQueries('SCHEDULE_LOCAL')
            await client.invalidateQueries('USER_DONATIONS')
            setDeleting(false)
            setdelItem(null)
            setConfirmDel(null)

        }
    })

    const confirmDonation = useMutation(async(args) => {

        return await api.patch(`/donations/${args.local.cnpj}+${args.date}+${args.hour}`)
    }, {
        onSuccess: async () => {
            alert('Confirmação realizada com sucesso.')

            await client.invalidateQueries('SCHEDULE_LOCAL')
            await client.invalidateQueries('USER_DONATIONS')


        }
    })
    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused

            setScreen(!screen)
            setUser(client.getQueryData('USER_TYPE'))

        });
    }, [navigation]);
    useEffect(() => {
        confirmDel && delSchedule.mutate({cnpj: delItem.local.cnpj, delItem })
    }, [confirmDel])
    return (
        <>
            <SafeAreaView  style={[donations?.length === 0 && ST.centeredView2,{backgroundColor: 'white', width: '100%', height: '100%'}]}>



                {donations?.length === 0 && <>
                    <Text style={donationStyle.text}>Não há doações agendadas.</Text>
                    <Image source={cry} style={{width: 90, height: 90}}/>


                </>}
                {donations?.length > 0 &&  <>
                    {  donations.find(d => d.status === 'done') &&<View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        width: '95%',
                        backgroundColor: 'rgba(255,198,107,0.8)',
                        marginHorizontal: 10
                    }}>


                    </View>}

                    <FlatList
                        contentContainerStyle={{alignSelf: 'flex-start', width: '100%'}}
                        onRefresh={() => setRefresh(true)}
                        refreshing={refresh}
                        data={donations}
                        renderItem={({item, index}) => {
                            return <ScrollView>



                                <View key={item._id}>
                                    <View  style={{shadowColor: '#171717',
                                        shadowOffset: {width: -1, height: 0},
                                        shadowOpacity: 0.2,
                                        shadowRadius: 3, borderWidth:1, borderColor: '#ffbfbf', backgroundColor: '#FFF', borderRadius: 10, padding: 10, width: '95%', marginVertical: 10, alignSelf: 'center'}}>
                                        <View style={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', borderRadius: 50,
                                            backgroundColor: item?.status === 'scheduled' ? 'rgba(227,184,46,0.85)' : '#14bd2e', width: '20%'
                                        }}>

                                            <Text style={{fontSize: 12, fontFamily: 'SFBold',color: 'white', padding: 2   }}>{item?.status === 'scheduled' ? 'Agendada' : 'Realizada'}</Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>

                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <MaterialCommunityIcons name={'account-outline'} size={30} color={'tomato'}/>
                                                <Text style={{fontSize: 16, fontFamily: 'SFBold', marginLeft: 10}}>{item?.user?.name}</Text>
                                            </View>


                                        </View>


                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'id-card'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{item?.user?.cpf?.slice(0,3) + `.` + item?.user?.cpf?.slice(3,6) + '.' + item?.user?.cpf?.slice(6,9) + '-' + item?.user?.cpf?.slice(9,11) } </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'blood-bag'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4, color: 'tomato'}}>{item?.user?.bloodType?.toUpperCase() + item?.user?.bloodRh }</Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'calendar'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{`${item?.date.split('-')[2]}/${item?.date.split('-')[1]}/${item?.date.split('-')[0]}`} - {item?.hour + ':00h'}  </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, alignSelf: 'center'}}>
                                            {!(item?.status === 'done') && <TouchableOpacity
                                                color={"#841584"}
                                                style={[stylesAuth.LoginButton, {
                                                    padding: 8,
                                                    borderRadius: 6,
                                                    width: '40%',
                                                    marginRight: 6
                                                }]}
                                                onPress={() => defineDel(item)}
                                            >

                                                <Text style={[stylesAuth.LoginText, {fontSize: 12}]}>Cancelar
                                                    doação</Text>
                                            </TouchableOpacity>}
                                            {(item?.status !== 'done') && <TouchableOpacity
                                                color={"#841584"}
                                                style={[stylesAuth.LoginButton, {
                                                    padding: 8,
                                                    borderRadius: 6,
                                                    width: '40%',
                                                    marginRight: 6,
                                                    backgroundColor: '#68be68'
                                                }]}
                                                onPress={() => confirmDonation.mutate(item)}
                                            >

                                                <Text style={[stylesAuth.LoginText, {fontSize: 12}]}>Confirmar doação</Text>
                                            </TouchableOpacity>}
                                            {deleting && <DeleteDonationModal del={{deleting, setDeleting}} cDel={{confirmDel, setConfirmDel}} />}






                                        </View>




                                    </View>
                                </View>




                            </ScrollView>
                        }}

                    /></>}



            </SafeAreaView>

        </>


)
}

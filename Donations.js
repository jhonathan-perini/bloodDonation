import {Text, TouchableOpacity, View, SafeAreaView, Image, StyleSheet, FlatList, ScrollView} from "react-native";
import cry from './assets/cry.png'
import StorageModal, {styles as ST} from "./StorageModal";
import {stylesAuth} from "./Authentication";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {auth} from "./firebaseConfig";
import api from "./api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {retrieveDate} from "./Locals";
import DeleteDonationModal from "./DeleteDonationModal";
import {StatusBar} from "expo-status-bar";


export default function Donations({navigation}){
const [deleting, setDeleting] = useState(false)
const [delItem, setdelItem] = useState(null)
const [confirmDel, setConfirmDel] = useState(null)
    const client = useQueryClient()
    const [user, setUser] = useState('')
    const [screen, setScreen] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const {data: donations} = useQuery(['USER_DONATIONS', refresh], async() => {
        if(auth.currentUser?.email){

            const response = await api.get(`/donations/${auth.currentUser?.email}`)

            setRefresh(false)

            return response.data
        }
    })

    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused

           setScreen(!screen)
            client.refetchQueries('USER_TYPE')
            setUser(client.getQueryData('USER_TYPE'))

        });
    }, [navigation, auth]);





    const delSchedule = useMutation(async(args) => {
        return await api.patch(`/del-schedule/${args.cnpj}`, args)
    }, {
        onSuccess: async () => {
            alert('Agendamento excluído com sucesso.')
            await client.invalidateQueries('SCHEDULE_LOCAL')
            await client.invalidateQueries('USER_DONATIONS')
            setDeleting(false)
            setdelItem(null)
            setConfirmDel(null)

        }
    })
    function defineDel(item){
    setDeleting(true)
        setdelItem(item)
    }

    function checkUserCpf(){
        if(user?.cpf?.length === 11 && user?.name?.length > 0
            && user?.genre?.length > 0 && user?.bloodType?.length > 0  && user?.bloodRh?.length > 0){
            navigation.navigate('BeforeScheduleInfo')
        } else {
            alert("Preencha todas as suas informações em 'Meus dados' para continuar")        }

    }
function startSchedule(){
        const donation = donations.find(d => d.status === 'scheduled')
    const d = getDate(true)

    if(donation){
        alert('Você pode ter somente uma doação agendada.')
    } else if (new Date(d) > new Date()) alert(`Você poderá agendar uma nova doação em ${d.toLocaleDateString('pt-BR')}`)
        else navigation.navigate('BeforeScheduleInfo', {donations})
}
    function getDate(asDate){
        const donationDone = donations.find(d => d.status === 'done')
        let d = new Date(donationDone?.date)
        d.setDate(d.getDate() + 90)

        return asDate ? d : d.toLocaleDateString('pt-BR')
    }
useEffect(() => {
    confirmDel && delSchedule.mutate({cnpj: delItem.local.cnpj, delItem })
}, [confirmDel])
    return(
        <>
        <SafeAreaView style={[donations?.length === 0 && ST.centeredView,{backgroundColor: 'white', width: '100%', height: '100%'}]}   >

            {donations?.length > 0 &&
                <TouchableOpacity
                    color={"#841584"}
                    onPress={startSchedule}
                    style={[stylesAuth.LoginButton, {
                        padding: 10,
                        borderRadius: 80,
                       width: 50,
                        height: 50,

                        backgroundColor: '#da1111',
                        marginRight: 10,
                        marginBottom: 10,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10
                    }]}
                >
                    <Text style={[stylesAuth.LoginText, {fontSize: 20, position: 'absolute', }]}>+</Text>
                </TouchableOpacity>
         }

            {donations?.length === 0 && <>
                <Text style={donationStyle.text}>Você ainda não possui doações</Text>
                <Image source={cry} style={{width: 90, height: 90}}/>

                <TouchableOpacity
                    color={"#841584"}
                    onPress={checkUserCpf}
                    style={[stylesAuth.LoginButton, {
                        padding: 10,
                        borderRadius: 6,
                        width: '50%',
                        backgroundColor: '#da1111'
                    }]}
                >
                    <Text style={[stylesAuth.LoginText, {fontSize: 14}]}>Agendar doação</Text>
                </TouchableOpacity>
            </>}
            {donations?.length > 0&&  <>
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
                    <Text style={{
                        borderRadius: 10,
                        width: '95%',
                        paddingVertical: 6,
                        color: 'black',
                        fontFamily: 'SFRegular'
                    }}>Você poderá doar novamente em {getDate()} </Text>

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
                                        elevation: 2,
                                        shadowRadius: 3, backgroundColor: '#FFF', borderRadius: 10, padding: 10, width: '95%', marginVertical: 10, alignSelf: 'center'}}>
                                        <View style={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', borderRadius: 50,
                                            backgroundColor: item?.status === 'scheduled' ? 'rgba(227,184,46,0.85)' : '#14bd2e', width: '20%'
                                        }}>

                                            <Text style={{fontSize: 12, fontFamily: 'SFBold',color: 'white', padding: 2   }}>{item?.status === 'scheduled' ? 'Agendada' : 'Realizada'}</Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>

                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <MaterialCommunityIcons name={'hospital-box-outline'} size={30} color={'tomato'}/>
                                                <Text style={{fontSize: 16, fontFamily: 'SFBold', marginLeft: 10}}>{item?.local?.name}</Text>
                                            </View>


                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5,}}>
                                            <MaterialCommunityIcons name={'map-marker-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item?.local, 'street')} </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'city-variant-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item?.local, 'city')}  </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'car-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{item?.local?.distance.text} - {item?.local?.duration.text} </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'cellphone'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>To be available </Text>
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

export const donationStyle = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'SFBold'
    }
})
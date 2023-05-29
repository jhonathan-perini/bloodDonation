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
    const user = client.getQueryData('USER_TYPE')
    const [screen, setScreen] = useState(false)
    const {data: donations} = useQuery(['USER_DONATIONS', screen], async() => {
        if(auth.currentUser){
            const response = await api.get(`/donations/${user?.email}`)

            return response.data
        }
    })
    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused

           setScreen(!screen)


        });
    }, [navigation]);


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
useEffect(() => {
    confirmDel && delSchedule.mutate({cnpj: delItem.data.local.cnpj, delItem })
}, [confirmDel])
    return(
        <>
        <SafeAreaView style={[donations?.length === 0 && ST.centeredView,{backgroundColor: 'white', width: '100%', height: '100%'}]}>
            {donations?.length > 0 &&
                <TouchableOpacity
                    color={"#841584"}
                    onPress={() => navigation.navigate('BeforeScheduleInfo')}
                    style={[stylesAuth.LoginButton, {
                        padding: 10,
                        borderRadius: '50%',
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
                    <Text style={[stylesAuth.LoginText, {fontSize: 24}]}>+</Text>
                </TouchableOpacity>
         }

            {donations?.length === 0 && <>
                <Text style={donationStyle.text}>Você ainda não possui doações</Text>
                <Image source={cry} style={{width: 90, height: 90}}/>

                <TouchableOpacity
                    color={"#841584"}
                    onPress={() => navigation.navigate('BeforeScheduleInfo')}
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
            {donations?.length > 0&&  <FlatList
                contentContainerStyle={{alignSelf: 'flex-start', width: '100%'}}

                data={donations}
                renderItem={({item, index}) => {
                    return <ScrollView>

                            {item.schedule?.filter(item => item.data).map(item => {
                                return (
                                    <View key={item._id} style={{shadowColor: '#171717',
                                        shadowOffset: {width: -1, height: 0},
                                        shadowOpacity: 0.2,
                                        shadowRadius: 3, backgroundColor: '#FFF', borderRadius: 10, padding: 10, width: '95%', marginVertical: 10, alignSelf: 'center'}}>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <MaterialCommunityIcons name={'hospital-box-outline'} size={30} color={'tomato'}/>
                                                <Text style={{fontSize: 16, fontFamily: 'SFBold', marginLeft: 10}}>{item?.data?.local?.name}</Text>
                                            </View>


                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5,}}>
                                            <MaterialCommunityIcons name={'map-marker-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item?.data?.local, 'street')} </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'city-variant-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item?.data?.local, 'city')}  </Text>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                                            <MaterialCommunityIcons name={'car-outline'} size={20} color={'black'}/>
                                            <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{item?.data?.local?.distance.text} - {item?.data?.local?.duration.text} </Text>
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
                                            <TouchableOpacity
                                                color={"#841584"}
                                                style={[stylesAuth.LoginButton, {padding: 8, borderRadius: 6, width: '40%', marginRight: 6}]}
                                                onPress={() => defineDel(item)}
                                            >
                                                <Text style={[stylesAuth.LoginText, {fontSize: 12}]}>Cancelar doação</Text>
                                            </TouchableOpacity>
                                           <DeleteDonationModal del={{deleting, setDeleting}} cDel={{confirmDel, setConfirmDel}} />



                                        </View>




                                    </View>
                                )

                            })}

                    </ScrollView>
                }}
            />}

        </SafeAreaView>

    </>
    )
}

const donationStyle = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'SFBold'
    }
})
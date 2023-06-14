import {Text, Button, FlatList, View, Pressable, TouchableOpacity, Image} from "react-native";
import {useQuery, useQueryClient} from "react-query";
import api from "./api";
import React, {useContext, useEffect, useState} from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {TextInput} from "react-native-paper";
import {stylesAuth} from "./Authentication";
import lock from "./assets/blood-bag.png";
import war from './assets/warning2.png'
import bloodap from './assets/blood-bag-ap.png'
import StorageModal from "./StorageModal";
import Overlay from "./Overlay";
export function retrieveDate(item, type){
    const firstDigit = item.address.search(/\d/)
    const street = item.address.slice(0, firstDigit)


    const number = item.address.slice(firstDigit).replace(' ', '˜').split('˜')
    return type === 'street' ? `${street}, ${number[0]}` : `${number[1]}`
}
export default function Locals({navigation}){
    const client = useQueryClient()
    const [refresh, setRefresh] = useState(false)
const [userType, setUserType] = useState('')

    useEffect(() => {

    },[])
    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused

            setUserType(client.getQueryData('USER_TYPE'))


        });
    }, [navigation]);

    const {data: matrix} = useQuery(["USER_MATRIX", userType, refresh], async () => {
        if(userType?.street?.length > 0 ){
                const response = await api.post(`/locals`, userType)
setRefresh(false)
            return  response.data
        }
    })

    function getSupply(item, type){
        if(item?.hasOwnProperty('supply')){
            return item.supply[type]
        } else return '0'
    }


    function checkUserCpf(item){
        if(userType?.cpf?.length === 11 && userType?.name?.length > 0
            && userType?.genre?.length > 0 && userType?.bloodType?.length > 0  && userType?.bloodRh?.length > 0  ){
            navigation.navigate('DonationSchedule', {local: item})
        } else {
            alert("Preencha todas as suas informações em 'Meus dados' para continuar")
        }

    }
const [overlay, setOverlay] = useState(false)
const [supply, setSupply] = useState({})
    return(
        // <Button onPress={search} title={'oi'}></Button>
        <>


        <View style={{display: 'flex', alignItems: 'center', width: '100%', backgroundColor: 'white', height: '100%'}}>

            {userType?.cep?.length > 0 ?  <><Image source={lock} style={[stylesAuth.LockImage,]}/>
                <Text style={{fontFamily: 'SFRegular', marginVertical: 10, textAlign: 'center', width: '95%', fontSize: 16}}>Escolha um de nossos parceiros e agende sua doação!</Text>


                <FlatList
                data={matrix}
                style={{width: '100%'}}
                onRefresh={() => setRefresh(true)}
                refreshing={refresh}
                renderItem={({item}) => {
                return (
                <View style={{shadowColor: '#171717',
                shadowOffset: {width: -1, height: 0},
                shadowOpacity: 0.2,
                    elevation: 2,
                shadowRadius: 3, backgroundColor: '#FFF', borderRadius: 10, padding: 10, width: '95%', marginVertical: 10, alignSelf: 'center'}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <MaterialCommunityIcons name={'hospital-box-outline'} size={30} color={'tomato'}/>
                <Text style={{fontSize: 16, fontFamily: 'SFBold', marginLeft: 10}}>{item.name}</Text>
                </View>


                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5,}}>
                <MaterialCommunityIcons name={'map-marker-outline'} size={20} color={'black'}/>
                <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item, 'street')} </Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <MaterialCommunityIcons name={'city-variant-outline'} size={20} color={'black'}/>
                <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{retrieveDate(item, 'city')}  </Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <MaterialCommunityIcons name={'car-outline'} size={20} color={'black'}/>
                <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>{item.distance.text} - {item.duration.text} </Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <MaterialCommunityIcons name={'cellphone'} size={20} color={'black'}/>
                <Text style={{fontSize: 12, fontFamily: 'SFRegular', marginLeft:4}}>To be available </Text>
                </View>

                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, alignSelf: 'center'}}>
                <TouchableOpacity
                color={"#841584"}
                style={[stylesAuth.LoginButton, {padding: 8, borderRadius: 6, width: '40%', marginRight: 6}]}
                onPress={() => checkUserCpf(item)}
                >
                <Text style={[stylesAuth.LoginText, {fontSize: 12}]}>Agendar doação</Text>
                </TouchableOpacity>
                    {item.hasOwnProperty('supply') && <StorageModal overlay={{overlay, setOverlay}} supply={item}/>}



                </View>



                </View>
                )

            }}
                /></> :


                <View style={{display: 'flex', alignItems: 'center', width: '100%', backgroundColor: 'white', height: '100%',justifyContent: 'center'}}>

                    <Image source={war} style={[stylesAuth.LockImage, {width: 160, height: 160}]}/>
                    <Text style={{fontFamily: 'SFLight', marginVertical: 20, textAlign: 'center', width: '95%', fontSize: 20}}>Preencha seu endereço em "Meus dados" para continuar!</Text>
                    <TouchableOpacity
                        color={"#841584"}
                        style={[stylesAuth.LoginButton, {padding: 8, borderRadius: 6, width: '40%', marginRight: 6}]}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={[stylesAuth.LoginText, {fontSize: 12}]}>Preencher endereço</Text>
                    </TouchableOpacity>
                </View>
                }
        </View>
        </>
    )
}
import {Text, FlatList, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator} from "react-native";
import {auth} from "./firebaseConfig";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useFonts} from "expo-font";
import React, {useRef, useState} from "react";
import Overlay from "./Overlay";
import {useQueryClient} from "react-query";

export default function Settings({navigation}){
    const client = useQueryClient()
const [isLoading, setIsLoading] = useState(false)
    function logOut(){
    setIsLoading(true)
        auth.signOut().then(res => {
            setIsLoading(false)
            client.removeQueries(['USER_TYPE'])
            client.removeQueries(['USER_SUPPLY'])
        }).catch(err => {
            alert(JSON.stringify(err))
            setIsLoading(false)
        })
    }

    function navigate(page){
        navigation.navigate(page)
    }
    const type = client.getQueryData('USER_TYPE')

    const dataPartner = [
        {key: 'Meus dados', icon: 'account', page: 'Profile' },

        {key: 'Notificações', icon: 'bell', page: 'Notification'},
        {key: 'Sair', icon: 'logout', action: logOut},
    ]

    const dataDonor = [
        {key: 'Meus dados', icon: 'account', page: 'Profile' },
        {key: 'Informações', icon: 'information-outline', page: 'Information' },

        {key: 'Sair', icon: 'logout', action: logOut},
    ]
    return (
        <>

        <FlatList style={styles.back}
            data={!type?.cnpj ? dataDonor : dataPartner}
            renderItem={({item}) => {


                return (
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? 'rgba(204,204,204,0.27)' : 'white',
                            },
                            styles.ListItem,
                        ]}
                        onPress={ item.key === 'Sair' ? item.action : () => navigation.navigate(item.page)}
                    >
                        <MaterialCommunityIcons name={item.icon} size={25} color={'tomato'}  />
                        <Text style={styles.item} >{item.key}</Text>
                    </Pressable>

                )
            }}
        />
        </>
    )
}


const styles = StyleSheet.create({
    ListItem: {
        width: '100%',

        borderColor: 'rgba(0,0,0,0.11)',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',

    },
    back: {
        backgroundColor: 'white'
    },
    item: {
        fontSize: 18,
        paddingLeft: 10,
        fontFamily: 'SFLight'
    }

})
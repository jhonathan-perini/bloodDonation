import {Text, TouchableOpacity, View, SafeAreaView, Image, StyleSheet} from "react-native";
import cry from './assets/cry.png'
import {styles as ST} from "./StorageModal";
import {stylesAuth} from "./Authentication";
import React from "react";


export default function Donations({navigation}){
const a = true
    return(
        <SafeAreaView style={[a && ST.centeredView,{backgroundColor: 'white', width: '100%', height: '100%'}]}>
            {!a &&
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
                        alignItems: 'center'
                    }]}
                >
                    <Text style={[stylesAuth.LoginText, {fontSize: 24}]}>+</Text>
                </TouchableOpacity>
         }

            {a && <>
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
        </SafeAreaView>
    )
}

const donationStyle = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'SFBold'
    }
})
import {Image, View, Text, TouchableOpacity, Button} from 'react-native'
import cry from "./assets/blood-donation-2.png";
import React from "react";
import {stylesAuth} from "./Authentication";
export default function ScheduleConfirmation({navigation}){

    return (
        <View style={{width: '100%', backgroundColor: 'rgba(255,255,255,0.55)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: '90%', backgroundColor: 'white', height: '90%', display: 'flex', alignItems: 'center',justifyContent: 'center', shadowColor: '#171717',
                shadowOffset: {width: -1, height: 0},
                shadowOpacity: 0.2,
                elevation: 2,
                shadowRadius: 3, borderRadius: 20}}>
            <Image source={cry} style={{width: 220, height: 220, marginTop: '10%', marginBottom: '5%'}}/>
            <Text style={{fontFamily: 'SFLight', fontSize: 30, textAlign: 'center', marginBottom: 16}}>Você é o tipo certo para alguém!</Text>
            <Text style={{fontFamily: 'SFBold', fontSize: 30, textAlign: 'center', marginBottom: 16}}>Obrigado.</Text>
                <TouchableOpacity
                    style={stylesAuth.LoginButton}
onPress={() => navigation.navigate('Donations')}
                >
                    <Text  style={stylesAuth.LoginText}>Minhas doações</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}
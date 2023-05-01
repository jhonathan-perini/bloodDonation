import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, TouchableOpacity, View, Image} from 'react-native';
import lock from './assets/locks.png'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./firebaseConfig";
import verifyErrorCode from "./firebaseError";

export default function Authentication(){
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');

    function registerUser(){

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(verifyErrorCode(errorCode))
                // ..
            });
    }

    function logIn(){
        signInWithEmailAndPassword(auth, email.toLowerCase(), password).then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(user)

            // ...
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(verifyErrorCode(errorCode))
            // ..
        });
    }


    return (

        <SafeAreaView style={stylesAuth.SafeAreaWidth}>
            <Image source={lock} style={stylesAuth.LockImage}/>
            <Text style={stylesAuth.FormWelcomeText}>Bem-vindo</Text>
            <View style={stylesAuth.FormContainer}>
                <TextInput
                    theme={{ colors: { onSurface: "black"}}} mode="outlined"
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangeEmail}
                    value={email.toLowerCase()}
                    placeholder={"Seu email"}
                    placeholderTextColor={"#00000050"}
                />
                <TextInput
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder={"Sua senha"}
                    secureTextEntry={true}
                    placeholderTextColor={"#00000050"}
                />
                <TouchableOpacity
                    color={"#841584"}
                    style={stylesAuth.LoginButton}
                    onPress={logIn}
                >
                    <Text style={stylesAuth.LoginText}>Login</Text>
                </TouchableOpacity>
                <View>

                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        alignSelf:'center',
                        width: '35%',
                        marginTop: 20,
                        marginBottom: 10,
                    }}
                />

                <TouchableOpacity
                   onPress={registerUser}
                    color={"#841584"}
                    style={stylesAuth.RegisterButton}
                >
                    <Text style={stylesAuth.RegisterText}>Registrar</Text>
                </TouchableOpacity>
            </View>



        </SafeAreaView>
    )
}

export const stylesAuth = StyleSheet.create({
    TextInputStyle: {
        height: 50,
        margin: 12,
        borderWidth: 0,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#00000010",
        color: "#3d3d3d",
        width: '60%'
    },
    SafeAreaWidth: {
      width: '100%',
        backgroundColor: 'rgba(255,68,68,0.07)',
        height: "100%",
        display: 'flex',

    },
    LoginButton: {
        backgroundColor: "rgba(255,68,68,0.8)",
        borderRadius: 10,
        padding: 12,
        width: '40%',
        marginTop: 10

    },
    RegisterButton: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 12,
        width: '40%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(255,68,68,0.23)"

    },
    LoginText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "bold"
    },
    RegisterText: {
        color: "#FF4444",
        textAlign: "center",
        fontWeight: "bold"
    },
    FormContainer:{
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"

    },
    FormWelcomeText: {
        textAlign: 'center',
        fontSize: 30,
        margin: 20,
        fontWeight: 'bold'
    },
    LockImage:{
        width: 120,
        height: 120,
        alignSelf: "center",
        marginBottom: 10,
        marginTop: '25%'
    }
});

import {stylesAuth} from "./Authentication";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";

export default function PartnerRegistration({navigation}){
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    return (
        <SafeAreaView style={stylesAuth.SafeAreaWidth}>
            <View style={stylesAuth.FormContainer}>
                <Text style={styles.FormTextMain}>Ficamos felizes em saber que deseja ser nosso parceiro e nos ajudar nessa causa.</Text>
                <Text style={styles.FormText}>Para continuar, precisamos de algumas informações.</Text>
                <TextInput
                    theme={{ colors: { onSurface: "black"}}} mode="outlined"
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangeEmail}
                    value={email.toLowerCase()}
                    placeholder={"Seu CNPJ"}
                    placeholderTextColor={"#00000050"}
                />
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
                <TextInput
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder={"Confirme sua senha"}
                    secureTextEntry={true}
                    placeholderTextColor={"#00000050"}
                />
                <TouchableOpacity
                    color={"#841584"}
                    style={stylesAuth.LoginButton}

                >
                    <Text style={stylesAuth.LoginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    FormTextMain: {
        textAlign: 'center',
        fontSize: 18,
        margin: 20,
        fontWeight: 'bold',
        lineHeight: 24
    },
    FormText: {
        textAlign: 'center',
        fontSize: 14,
        margin: 10,

    },
})
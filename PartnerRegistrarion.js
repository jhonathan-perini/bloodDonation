import {stylesAuth} from "./Authentication";
import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import hands from "./assets/join-our-team.png";
import {cnpjValidation} from "./ValidatorCNPJ";
import CustomInput from "./CustomInput";
import isEmail from 'validator/lib/isEmail';
import {addDoc, collection} from "firebase/firestore";
import {auth, db} from "./firebaseConfig";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {useMutation} from "react-query";
import api from "./api";
import {ActivityIndicator} from "react-native";
import Overlay from "./Overlay";
import verifyErrorCode from "./firebaseError";
export default function PartnerRegistration({navigation}){
    const initialStateError = {
        cnpj: false,
        email: false,
        password: false,
        cPassword: false
    }
    const [email, onChangeEmail] = useState('');
    const [cnpj, onChangeCnpj] = useState('');
    const [password, onChangePassword] = useState('');
    const [cPassword, onChangeCPassword] = useState('');
    const [errors, setErrors] = useState(initialStateError)

    function validate(field, value){
        if(field === 'cnpj') setErrors(prevState => ({...prevState, cnpj: cnpjValidation(value)}))
        if(field === 'password') setErrors(prevState => ({...prevState, password: value.length >= 6}))
        if(field === 'cPassword') setErrors(prevState => ({...prevState, cPassword: (value.length >= 6 && password === value)}))
        if(field === 'email') setErrors(prevState => ({...prevState, email: isEmail(value)}))
    }

function onChangeValues(field, fn, e){
        fn(e)
        validate(field, e)
}

const {mutate: createPartner, isLoading: isLoadingCreatePartner} = useMutation(async(args) => {
    const {email, password, cnpj} = args
    const isCNPJBeingUsed = await api.get(`/partner/${cnpj}`)

    if(isCNPJBeingUsed.data){
       alert('Este CNPJ já está em uso.')
    } else {
        try{
            const user = await createUserWithEmailAndPassword(auth, email, password)
            return api.post('/create-partner', {email, cnpj})
        } catch (err){
            const errorCode = err.code;
            const errorMessage = err.message;
           alert(verifyErrorCode(errorCode))
        }
    }




})
    function registerPartner(){
        const validations = Object.keys(errors)?.map(key => errors[key] ? 1 : 0).reduce((prev, curr) => prev + curr)

        if(validations === 4){
            const values = {email, cnpj, password}
            createPartner(values)
        } else {

            alert('Preencha todos os campos corretamente.')

        }

    }





    return (
   <>
       {isLoadingCreatePartner && <Overlay/>}

       <SafeAreaView style={stylesAuth.SafeAreaWidth}>
           {isLoadingCreatePartner &&  <ActivityIndicator size="large" style={{position: 'absolute', alignSelf:'center', zIndex: 3}} color="#000" />}

            <View style={stylesAuth.FormContainer}>

                <Image source={hands} style={stylesAuth.LockImage}/>
                <Text style={styles.FormTextMain}>Ficamos felizes em saber que deseja ser nosso parceiro e nos ajudar nessa causa.</Text>

                <Text style={styles.FormText}>Para continuar, precisamos de algumas informações.</Text>
                <CustomInput
                props={{
                    onChangeText: (e) => onChangeValues('cnpj', onChangeCnpj, e),
                    value: cnpj,
                    placeholder:"Seu CNPJ",
                    type: 'numeric',
                    correct:  errors.cnpj,
                    errorText: 'CNPJ inválido'
                }}
                />

                <CustomInput
                    props={{
                        onChangeText: (e) => onChangeValues('email', onChangeEmail, e),
                        value: email.toLowerCase(),
                        placeholder:"Seu email",
                        type: 'text',
                        correct: errors.email,
                        errorText: 'Email inválido'
                    }}
                />

                <CustomInput
                    props={{
                        onChangeText: (e) => onChangeValues('password', onChangePassword, e),
                        value: password,
                        placeholder:"Sua senha",
                        type: 'text',
                        correct: errors.password,
                        secureTextEntry: true,
                        errorText: 'A senha precisa conter 6 dígitos ou mais.'
                    }}
                />
                <CustomInput
                    props={{
                        onChangeText: (e) => onChangeValues('cPassword', onChangeCPassword, e),
                        value: cPassword,
                        placeholder:"Confirme sua senha",
                        type: 'text',
                        correct: errors.cPassword,
                        secureTextEntry: true,
                        errorText: 'Senhas não conferem.'
                    }}
                />
                <TouchableOpacity
                    color={"#841584"}
                    style={stylesAuth.LoginButton}
                    onPress={registerPartner}
                >
                    <Text style={stylesAuth.LoginText}>Finalizar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
       </>

    )
}


const styles = StyleSheet.create({
    FormTextMain: {
        textAlign: 'center',
        fontSize: 16,
        margin: 20,
        fontWeight: 'bold',
        lineHeight: 24,
        fontFamily: 'SFRegular'
    },
    FormText: {
        textAlign: 'center',
        fontSize: 14,
        margin: 10,
        fontFamily: 'SFBold'

    },
})
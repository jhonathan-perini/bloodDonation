import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import lock from './assets/locks.png'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./firebaseConfig";
import verifyErrorCode from "./firebaseError";
import SwitchSelector from "react-native-switch-selector";
import blood from './assets/blood-donor.png'
import hospital from './assets/hospital.png'
import Overlay from "./Overlay";
import api from "./api";
import {useMutation, useQueryClient} from "react-query";
export default function Authentication({navigation}){
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const {mutate: registerUser, isLoading: isLoadingRegister} = useMutation(async() => {

            try{

                const user = await createUserWithEmailAndPassword(auth, email, password)
                return api.post('/user', {email})
            } catch (err){
                const errorCode = err.code;
                const errorMessage = err.message;
                alert(verifyErrorCode(errorCode))
            }





    })

    const [isLoading, setIsLoading] = useState(false)
    const [cnpj, setCnpj] = useState('')
    const client = useQueryClient()
    function logIn(){

        setIsLoading(true)
        if(userType === 'partner' ){
                    if(cnpj){
                        api.get(`/partner/${cnpj}`).then(res =>{
                            if(res.data.hasOwnProperty('email')){
                                signInWithEmailAndPassword(auth, res.data.email, password).then((userCredential) => {
                                    // Signed in
                                    let user = userCredential.user;
                                    setIsLoading(false)

                                    // ...
                                }).catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    alert(verifyErrorCode(errorCode))
                                    setIsLoading(false)
                                    // ..
                                });
                            } else {
                                alert('CNPJ não encontrado.')
                                setIsLoading(false)
                            }

                        }).catch(err => {
                            setIsLoading(false)

                        })
                    } else {
                        alert('Preencha o campo CNPJ.')
                        setIsLoading(false)
                    }

        } else {
            signInWithEmailAndPassword(auth, email.toLowerCase(), password).then((userCredential) => {
                // Signed in
                let user = userCredential.user;
                setIsLoading(false)

                // ...
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(verifyErrorCode(errorCode))
                setIsLoading(false)
                // ..
            });
        }
client.invalidateQueries(['USER_TYPE'])
    }
const [userType, setUserType] = useState('donor')
    const options = [
        { label: 'Doador', value: 'donor', imageIcon: blood },
        { label: 'Parceiro', value: 'partner', imageIcon: hospital },

    ];
    return (
<>
    {isLoading && <Overlay/>}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesAuth.SafeAreaWidth}>
            {isLoading &&  <ActivityIndicator size="large" style={{position: 'absolute', alignSelf:'center', zIndex: 3}} color="#000" />}
            <View style={stylesAuth.FormContainer}>
                <Image source={lock} style={stylesAuth.LockImage}/>
                <Text style={stylesAuth.FormWelcomeText}>Bem-vindo</Text>
                <SwitchSelector textColor={"rgba(255,68,68,0.8)"} initial={0}  selectedColor={'white'} buttonColor={"rgba(255,68,68,0.8)"} fontSize={14} animationDuration={200}  height={30} options={options} style={{width: '80%'}}  onPress={value => setUserType(value)} />


                {userType === 'partner' ? <TextInput
                    theme={{colors: {onSurface: "black"}}} mode="outlined"
                    style={stylesAuth.TextInputStyle}
                    onChangeText={setCnpj}
                    value={cnpj}
                    placeholder={"Seu CNPJ"}
                    placeholderTextColor={"#00000050"}
                    inputMode = 'numeric'
                /> :  <TextInput
                    theme={{ colors: { onSurface: "black"}}} mode="outlined"
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangeEmail}
                    value={email.toLowerCase()}
                    placeholder={"Seu email"}
                    placeholderTextColor={"#00000050"}
                />}
                <TextInput
                    style={stylesAuth.TextInputStyle}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder={"Sua senha"}
                    secureTextEntry={true}
                    placeholderTextColor={"#00000050"}
                />
                {/*<TouchableOpacity*/}
                {/*    color={"#841584"}*/}
                {/*    style={{alignSelf: 'flex-end', marginRight:  '10%'}}*/}
                {/*    onPress={logIn}*/}
                {/*>*/}
                {/*    <Text style={[stylesAuth.LoginText, {color: 'black'}]}>Sou parceiro</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    color={"#841584"}
                    style={stylesAuth.LoginButton}
                    onPress={logIn}
                >
                    <Text style={stylesAuth.LoginText}>Login</Text>
                </TouchableOpacity>
                <View>

                </View>
                {userType === 'donor' && <><View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        alignSelf: 'center',
                        width: '35%',
                        marginTop: 20,
                        marginBottom: 10,
                    }}
                />
                    <Text style={stylesAuth.RegisterLabel}>Ainda não faz parte?</Text>
                    <Text style={stylesAuth.RegisterLabel2}>Preencha os campos acima e clique em registrar.</Text>
                    <TouchableOpacity
                    onPress={registerUser}
                    color={"#841584"}
                    style={stylesAuth.RegisterButton}
                    >
                    <Text style={stylesAuth.RegisterText}>Registrar</Text>
                    </TouchableOpacity></>}
                {userType === 'partner' && <><View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        alignSelf: 'center',
                        width: '35%',
                        marginTop: 20,
                        marginBottom: 10,
                    }}
                />
                    <Text style={stylesAuth.RegisterLabel}>Quer ser um parceiro?</Text>
                    <TouchableOpacity
                    onPress={() => navigation.navigate("AuthPartner")}
                    color={"#841584"}
                    style={stylesAuth.PartnerButton}
                    >
                    <Text style={stylesAuth.LoginText}>Seja um parceiro</Text>
                    </TouchableOpacity></>}
            </View>



        </SafeAreaView>
    </TouchableWithoutFeedback>
</>
    )
}

export const stylesAuth = StyleSheet.create({
    TextInputStyle: {
        height: 50,
        marginTop: 8,
        marginBottom: 2,
        borderWidth: 0,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#00000010",
        color: "#3d3d3d",
        width: '80%',
        fontFamily: 'SFRegular'
    },
    TextInputStyleNumber: {
        borderWidth: 0,
        fontFamily: 'SFRegular'
    },
    SafeAreaWidth: {
      width: '100%',
        backgroundColor: 'rgba(255,68,68,0.07)',
        height: "100%",
        display: 'flex',
        justifyContent: 'center'

    },
    LoginButton: {
        backgroundColor: "rgba(255,68,68,0.8)",
        borderRadius: 10,
        padding: 4,
        width: '50%',
        marginTop: 10

    },
    PartnerButton: {
        backgroundColor: "rgb(89,89,89)",
        borderRadius: 10,
        padding: 4,
        width: '60%',


    },
    RegisterButton: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 4,
        width: '60%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(255,68,68,0.23)"

    },
    LoginText: {
        color: "#FFF",
        textAlign: "center",
        fontFamily: 'SFBold'
    },
    RegisterText: {
        color: "#FF4444",
        textAlign: "center",
        fontFamily: 'SFBold'
    },
    RegisterLabel: {
        color: "#282828",
        textAlign: "center",
        fontFamily: 'SFBold',
        width: '80%',
        marginBottom: 10

    },
    RegisterLabel2: {
        color: "#282828",
        textAlign: "center",
        width: '80%',
        lineHeight: 20,
        fontFamily: 'SFRegular'

    },
    FormContainer:{
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255,255,255,0.47)',
        marginHorizontal: 25,
        borderRadius: 30,
        paddingVertical: 30

    },
    FormWelcomeText: {
        textAlign: 'center',
        fontSize: 26,
        margin: 20,
        fontFamily: 'SFBold'
    },
    LockImage:{
        width: 110,
        height: 110,
        alignSelf: "center",

    }
});

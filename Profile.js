import {Text, View, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator} from "react-native";
import React, {useRef, useState} from "react";
import {stylesAuth} from "./Authentication";
import {auth} from "./firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import bloodA from './assets/blood-drop.png'
import bloodO from './assets/blood-type-2.png'
import bloodFill from './assets/blood-type-o.png'
import bloodBFill from './assets/blood-type-b-2-white.png'
import bloodFillA from './assets/blood-drop-white.png'
import bloodFillAB from './assets/blood-type-ab-white.png'
import bloodB from './assets/blood-type-b-2.png'
import bloodAB from './assets/blood-type-ab-2.png'
import rhPositive from './assets/blood-rh-positive.png'
import rhNegative from './assets/blood-rh-negative.png'
import rhNegativeWhite from './assets/blood-rh-negative-2.png'
import {useMutation, useQuery, useQueryClient} from "react-query";
import api from "./api";
import axios from "axios";
import CustomInput from "./CustomInput";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import Overlay from "./Overlay";


export default function Profile(){
    const [checked, setChecked] = useState('');
    const initialStateError = {
        cpf: false,
        cep: false,
    }
    const [errors, setErrors] = useState(initialStateError)
const client = useQueryClient()
    const [image, setImage] = useState(null);

    const pickerRef = useRef();
    const [personalInfo, setPersonalInfo] = useState({cpf: '', cep: '', state: '', city: '', neighborhood: '', street: '', number: '', genre: '', bloodType: '', bloodRh: '' })
   const {data: userType} = useQuery(["USER_TYPE"], async() => {
        if(auth.currentUser?.email) {

            const response = await api.get(`/find-user/${auth.currentUser.email}` )
            setPersonalInfo(prevState => ({...prevState, ...response.data}))
            validate('cpf', response.data?.cpf)
            return response.data
        }
    })
    function validate(field, value){
        if(field === 'cpf') setErrors(prevState => ({...prevState, cpf: cpfValidator.isValid(value)}))


    }
    const saveInfo = useMutation(async(args) => {
if(userType?.cnpj){
    delete args?.genre
    delete args?.bloodType
    delete args?.bloodRh
}
        if(args.bloodType && !args.bloodRh) return alert('Preencha o fator do seu tipo sanguíneo.')
        if(!errors.cpf && personalInfo.cpf.length > 0 && !userType?.cnpj) return  alert('CPF inválido.')
        if(auth.currentUser) {
            if(errors.cep){
                if(personalInfo?.street?.length > 0 ){
                    if(!personalInfo?.number){
                        alert('Preencha o número do local.')
                    } else {
                        if(!userType){
                            return await api.post(`/user`, args)
                        } else {
                            return await api.patch(`/user/${userType?._id}`, args)
                        }
                    }

                } else {

                    alert('Preencha um CEP válido.')
                }

            } else if(!errors.cep && personalInfo?.cep?.length === 0 ) {
                if(!userType){
                    return await api.post(`/user`, args)
                } else {
                    return await api.patch(`/user/${userType?._id}`, args)
                }

            } else {
                alert('Preencha o CEP corretamente.')
            }



        }
    }, {
        onSuccess: async() => {
            await client.refetchQueries("USER_TYPE")
            alert('Informações atualizadas com sucesso')
        },
        onError: async() => {

        }
    })
    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    function savePersonalInfo(){
        saveInfo.mutate(personalInfo)
    }
    function definePersonalInfo(value, field){
        setPersonalInfo(prevState => ({...prevState, [field]: value}))
        validate(field,value)
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });



        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useQuery(["USER_CEP", personalInfo.cep], async () => {
        if(personalInfo.cep?.length === 8){
            const response = await axios.get(`https://viacep.com.br/ws/${Number(personalInfo.cep)}/json/`, {baseURL: ''})
            if(response?.data?.logradouro){
                const {logradouro, bairro, localidade, uf} = response.data
                setPersonalInfo((prevState) => ({...prevState, state: uf, city: localidade, neighborhood: bairro, street: logradouro}))
                setErrors(prevState => ({...prevState, cep: true}))
            } else {
                setErrors(prevState => ({...prevState, cep: false}))
            }

        } else {
            setErrors(prevState => ({...prevState, cep: false}))
        }


    })

    return(
        <>
        {saveInfo.isLoading && <Overlay/>}
        <View style={{backgroundColor: 'white', height: '100%'}}>

            {saveInfo.isLoading &&  <ActivityIndicator size="large" style={{position: 'absolute', alignSelf:'center', top: '40%', zIndex: 3}} color="#000" />}
        <ScrollView contentContainerStyle={{ display: 'flex', alignItems: 'center'}} >

            <Image source={{uri: image || 'https://s2.glbimg.com/1o2J-rf2G9qtlQlm82gaq-mFBec=/0x129:1024x952/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/7/i/ME2AxRRoygUyFPCDe0jQ/3.png'}} style={{width: 100,
                height: 100,
                alignSelf: "center",
                borderRadius: 300,
                marginTop: 20,
                marginBottom: 10
                }}/>
            <TouchableOpacity

                color={"#841584"}
    onPress={pickImage}
            >
                <Text style={{color: 'tomato', marginBottom: 25}}>Alterar</Text>
            </TouchableOpacity>
            <TextInput
                theme={{ colors: { onSurface: "black"}}} mode="outlined"
                style={{ height: 50,
                    marginBottom: 12,
                    borderWidth: 0,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "#00000010",
                    color: "#3d3d3d",
                    width: '80%'}}
                placeholder={userType?.cnpj ? "Nome da entidade" : "Seu nome"}
                placeholderTextColor={"#00000050"}
                onChangeText={(e) => definePersonalInfo(e, 'name')}
                value={personalInfo?.name}
            />
            <TextInput
                theme={{ colors: { onSurface: "black"}}} mode="outlined"
                style={style.Button}
                value={auth?.currentUser?.email}
                placeholder={"Seu email"}
                placeholderTextColor={"#00000050"}
                editable={false}
                selectTextOnFocus={false}
            />
            <CustomInput
                props={{
                    onChangeText: (e) => definePersonalInfo(e, 'cpf'),
                    value: userType?.cnpj ? userType?.cnpj : userType?.cpf?.length > 0 ? userType?.cpf : personalInfo.cpf,
                    placeholder: userType?.cnpj ? 'Seu CNPJ' : "Seu CPF",
                    editable: !userType?.cnpj || !userType?.cpf?.length > 0,
                    type: 'numeric',
                    maxLength: 11,
                    correct: userType?.cnpj ? true : errors.cpf,
                    errorText: 'CPF inválido',

                }}
            />
            <CustomInput
                props={{
                    onChangeText: (e) => definePersonalInfo(e, 'cep'),
                    value: personalInfo.cep,
                    placeholder: 'Seu CEP',
                    editable: !userType?.cnpj || !userType?.cpf?.length > 0,
                    type: 'numeric',
                    maxLength: 8,
                    correct: errors.cep,
                    errorText: 'CEP inválido',

                }}
            />

            {(errors.cep && personalInfo?.state) && <TextInput
                theme={{colors: {onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={'Sua rua'}
                placeholderTextColor={"#00000050"}
                value={personalInfo?.street}
                editable={false}
            />}
            {(errors.cep && personalInfo?.state) && <TextInput
                theme={{colors: {onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={"Seu bairro"}
                placeholderTextColor={"#00000050"}
                value={personalInfo?.neighborhood}
                editable={false}
            />}
            {(errors.cep && personalInfo?.state) && <TextInput
                theme={{colors: {onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={"Número"}
                placeholderTextColor={"#00000050"}
                value={personalInfo?.number}
                onChangeText={(e) => definePersonalInfo(e, 'number')}
                inputMode='numeric'
            />}
            {(errors.cep && personalInfo?.state) && <TextInput
                theme={{colors: {onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={"Sua cidade"}
                placeholderTextColor={"#00000050"}
                value={personalInfo?.city}
                editable={false}
            />}
            {(errors.cep && personalInfo?.state) && <TextInput
                theme={{colors: {onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={"Seu estado"}
                placeholderTextColor={"#00000050"}
                value={personalInfo?.state}
                editable={false}
            />}

            {!userType?.cnpj && <View style={{
                display: 'flex',

                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>

                <TouchableOpacity
                    onPress={() => definePersonalInfo('female', 'genre')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.genre === 'female' ? "#ababab" : 'white',
                        borderRadius: 10,
                        padding: 10
                    }}>
                    <Text style={{color: personalInfo.genre === 'female' ? "white" : 'black'}}>Feminino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('male', 'genre')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.genre === 'male' ? "#ababab" : 'white',
                        borderRadius: 10,
                        padding: 10,
                    }}
                >
                    <Text style={{color: personalInfo.genre === 'male' ? "white" : 'black'}}>Masculino</Text>
                </TouchableOpacity>

            </View>}
            {!userType?.cnpj && <View style={{
                display: 'flex',

                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>

                <TouchableOpacity
                    onPress={() => definePersonalInfo('a', 'bloodType')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodType === 'a' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodType === 'a' ? bloodFillA : bloodA} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('b', 'bloodType')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodType === 'b' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodType === 'b' ? bloodBFill : bloodB} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('o', 'bloodType')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodType === 'o' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodType === 'o' ? bloodFill : bloodO} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('ab', 'bloodType')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodType === 'ab' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodType === 'ab' ? bloodFillAB : bloodAB} style={{width: 30, height: 30}}/>
                </TouchableOpacity>


            </View>}
            {personalInfo.bloodType && <View style={{
                display: 'flex',

                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('+', 'bloodRh')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodRh === '+' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodRh === '+' ? rhNegativeWhite : rhPositive} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => definePersonalInfo('-', 'bloodRh')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: personalInfo.bloodRh === '-' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={personalInfo.bloodRh === '-' ? rhNegativeWhite : rhNegative} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
            </View>}
            <TouchableOpacity
                onPress={savePersonalInfo}
                color={"#841584"}
                style={{    backgroundColor: "rgba(255,68,68,0.8)",
                    borderRadius: 10,
                    padding: 12,
                    width: '60%',
                    marginTop: 10,
                marginBottom: 30}}
            >
                <Text style={stylesAuth.LoginText}>Salvar</Text>
            </TouchableOpacity>


        </ScrollView>
        </View>
        </>
    )
}

export const style = StyleSheet.create({
    Button: {
        height: 50,
        margin: 12,
        borderWidth: 0 ,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#00000010",
        color: "#3d3d3d",
        width: '80%'
    }
})


import {Text, View, TextInput, StyleSheet, TouchableOpacity, Image} from "react-native";
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
import {useQueryClient} from "react-query";
import { storage } from "./firebaseConfig.js"


export default function Profile(){
    const [checked, setChecked] = useState('male');


    const [image, setImage] = useState(null);
    const [type, setType] = useState('');
    const [rh, setRh] = useState('');
    const pickerRef = useRef();
    const client = useQueryClient()
    const userType = client.getQueryData(['USER_TYPE'])
    const [imageURL, setImageURL] = useState("");
    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
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
            const file = result.assets[0].uri;
            setImage(result.assets[0].uri);
        }

        const storageRef = ref(storage, `images/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
        "state_change",
        () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
        setImageURL(url)
        })})
    };

    const storageRef = ref(storage, `images/${file.name}`)

    return(
        <View style={{ height: '100%', display: 'flex', alignItems: 'center', marginTop: '10%'}}>
        <View style={{backgroundColor: 'white', width: '90%', display: 'flex', alignItems: 'center', borderRadius: 20}} >
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
            <TextInput
                theme={{ colors: { onSurface: "black"}}} mode="outlined"
                style={style.Button}
                placeholder={userType?.cnpj ? 'Seu CNPJ' : "Seu CPF"}
                placeholderTextColor={"#00000050"}
                value={userType?.cnpj ? userType?.cnpj : ""}
                editable={!userType?.cnpj}
            />
            {!userType?.cnpj && <View style={{
                display: 'flex',
                alignSelf: 'start',
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>

                <TouchableOpacity
                    onPress={() => setChecked('female')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: checked === 'female' ? "#ababab" : 'white',
                        borderRadius: 10,
                        padding: 10
                    }}>
                    <Text style={{color: checked === 'female' ? "white" : 'black'}}>Feminino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setChecked('male')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: checked === 'male' ? "#ababab" : 'white',
                        borderRadius: 10,
                        padding: 10,
                    }}
                >
                    <Text style={{color: checked === 'male' ? "white" : 'black'}}>Masculino</Text>
                </TouchableOpacity>

            </View>}
            {!userType?.cnpj && <View style={{
                display: 'flex',
                alignSelf: 'start',
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>

                <TouchableOpacity
                    onPress={() => setType('a')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: type === 'a' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={type === 'a' ? bloodFillA : bloodA} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setType('b')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: type === 'b' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={type === 'b' ? bloodBFill : bloodB} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setType('o')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: type === 'o' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={type === 'o' ? bloodFill : bloodO} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setType('ab')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: type === 'ab' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={type === 'ab' ? bloodFillAB : bloodAB} style={{width: 30, height: 30}}/>
                </TouchableOpacity>


            </View>}
            {type && <View style={{
                display: 'flex',
                alignSelf: 'start',
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 35
            }}>
                <TouchableOpacity
                    onPress={() => setRh('+')}
                    style={{
                        marginRight: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: rh === '+' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={rh === '+' ? rhNegativeWhite : rhPositive} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setRh('-')}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: rh === '-' ? "rgba(255,68,68,0.8)" : 'white',
                        borderRadius: 10,
                        padding: 5
                    }}>
                    <Image source={rh === '-' ? rhNegativeWhite : rhNegative} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
            </View>}
            <TouchableOpacity

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

        </View>
        </View>
    )
}

const style = StyleSheet.create({
    Button: {
        height: 50,
        margin: 12,
        borderWidth: 0,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#00000010",
        color: "#3d3d3d",
        width: '80%'
    }
})


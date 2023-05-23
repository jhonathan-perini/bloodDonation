import {
    Modal,
    Text,
    TouchableOpacity,
    Pressable,
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native'
import {stylesAuth} from "./Authentication";
import React, {useContext, useEffect, useState} from "react";
import bloodap from './assets/blood-bag-ap.png'
import bloodam from './assets/blood-bag-am.png'
import bloodbp from './assets/blood-bag-bp.png'
import bloodbm from './assets/blood-bag-bm.png'
import bloodabp from './assets/blood-bag-abp.png'
import bloodabm from './assets/blood-bag-abm.png'
import bloodop from './assets/blood-bag-op.png'
import bloodom from './assets/blood-bag-om.png'
import doctor from './assets/blood-donation.png'
import TabContext from "./TabContext";


export default function StorageModal({overlay, supply}){
    const [state, setState] = useState(false)
    const bloodType = [{
        name: "A+",
        image: bloodap
    },{
        name: "A-",
        image: bloodam
    },{
        name: "B+",
        image: bloodbp
    },{
        name: "B-",
        image: bloodbm
    },{
        name: "O+",
        image: bloodop
    },{
        name: "O-",
        image: bloodom
    },{
        name: "AB+",
        image: bloodabp
    },{
        name: "AB-",
        image: bloodabm
    }]
    function handleModal(){

        setState(!state)

    }
const context = useContext(TabContext)
    useEffect(() => {
        state && context.setOverlay(true)
        !state && context.setOverlay(false)
    }, [state])
    return (
        <>



                <TouchableOpacity
                color={"#841584"}
                style={[stylesAuth.RegisterButton, {padding: 8, borderRadius: 6, width: '40%', marginRight: 6}]}
                onPress={handleModal }
            >
                <Text style={[stylesAuth.RegisterText, {fontSize: 12}]} >Ver estoque</Text>
            </TouchableOpacity>
        <Modal
    animationType="slide"
    transparent={true}
    visible={state}
    onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setState(!state);
    }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Text style={[styles.modalText, {fontFamily: 'SFBold', fontSize: 20}]}>Nosso banco de sangue</Text>

                    <FlatList
                        style={{width: '100%'}}
                        data={bloodType}
                        renderItem={({item}) => {
                            return (
                                <View style={{display: 'flex', marginVertical: 3, marginHorizontal: 2,paddingHorizontal: 15,    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 2,height: 50, flexDirection: 'row',alignItems: 'center', borderRadius: 10, justifyContent: 'space-between', borderWidth: 0, borderColor: 'rgba(0,0,0,0.10)', backgroundColor: 'white'}}>
                                    <Image source={item.image} style={{width: 35, height: 35}}/>

                                    <Text style={{fontFamily: 'SFBold', fontSize: 16}}  > {supply.supply[item.name]}</Text>


                                </View>
                            )

                        }}
                    />
                    <TouchableOpacity
                        color={"#841584"}
                        onPress={handleModal }
                        style={[stylesAuth.LoginButton, {padding: 10, borderRadius: 6, width: '50%', marginRight: 6}]}
                    >
                        <Text style={[stylesAuth.LoginText, {fontSize: 12}]} >Fechar</Text>
                    </TouchableOpacity>


                </View>
            </View>
    </Modal>
        </>
    )
}

export const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        width: '100%'

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',

    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
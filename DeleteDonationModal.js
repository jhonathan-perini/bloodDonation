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
import cry from "./assets/cry.png";


export default function DeleteDonationModal({del, cDel}){

const context = useContext(TabContext)
const [state,setState] = useState(false)

    function handleModal(text){
text === 'yes' && cDel.setConfirmDel(true)
text === 'no' && cDel.setConfirmDel(false)
        del.setDeleting(false)

    }

useEffect(() => {
    if(del.deleting) setState(true)
    if(!(del.deleting)) setState(false)

}, [del])

    return (
        <>




        <Modal
    animationType="slide"
    transparent={true}
    visible={state}
  >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.modalText, {fontFamily: 'SFBold', fontSize: 20}]}>Deseja realmente cancelar sua doação?</Text>


<View style={{display: 'flex', flexDirection: 'row'}}>


                    <TouchableOpacity
                        color={"#841584"}
                        onPress={() => handleModal('yes') }
                        style={[stylesAuth.RegisterButton, {padding: 10, borderRadius: 6, width: '40%', marginRight: 6}]}
                    >
                        <Text style={[stylesAuth.RegisterText, {fontSize: 12}]} >Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        color={"#841584"}
                        onPress={() => handleModal('no') }
                        style={[stylesAuth.LoginButton, {padding: 10, borderRadius: 6, width: '40%', marginRight: 6}]}
                    >
                        <Text style={[stylesAuth.LoginText, {fontSize: 12}]} >Não</Text>
                    </TouchableOpacity>
</View>

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
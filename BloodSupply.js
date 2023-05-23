import {Button, FlatList, Pressable, Text, View} from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, {useEffect, useState} from "react";
import {TextInput} from "react-native-paper";
import {useMutation, useQuery, useQueryClient} from "react-query";
import api from "./api";
import {auth} from "./firebaseConfig";

export default function BloodSupply({navigation}){
    const bloodType = [{
        name: "A+",
        image: ''
    },{
        name: "B+",
        image: ''
    },{
        name: "AB+",
        image: ''
    },{
        name: "O+",
        image: ''
    },{
        name: "A-",
        image: ''
    },{
        name: "B-",
        image: ''
    },{
        name: "AB-",
        image: ''
    },{
        name: "O-",
        image: ''
    }]
    const client = useQueryClient()
    const {data:userType}=useQuery(["USER_SUPPLY", auth.currentUser], async() => {
        if(auth.currentUser?.email) {

            const response = await api.get(`/find-user/${auth.currentUser.email}` )
            setQtd(prevState => ({...prevState, ...response.data?.supply}))

            return response.data
        }
    })


    const saveSupply = useMutation(async() => {
        const data = {...userType, supply: qtd}
        return await api.patch(`/user/${userType?._id}`, data)
    }, {
        onSuccess: async() => {
            await client.invalidateQueries(["USER_SUPPLY"])
            alert('Dados salvos com sucesso.')
        }
    })
    const initialState = {
        "A+": '0',
        "B+": '0',
        "O+": '0',
        "AB+": '0',
        "A-": '0',
        "B-": '0',
        "O-": '0',
        "AB-": '0',
    }
    const [qtd, setQtd] = useState(initialState)

    const [unsaved, setUnsaved] = useState(false)
    React.useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => saveSupply.mutate(qtd)} title="Salvar"  color="tomato"  />
            ),
        });
    }, [navigation]);

    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return navigation.addListener('focus', () => {
            // The screen is focused

                setQtd(prevState => ({...prevState, ...userType?.supply}))


        });
    }, [navigation]);
    function defineQuantity(value, name){
        if(Number(value) < 10000 && Number(value) >=0 ){
            setQtd(prevState => ({...prevState, [name]: value}))
            setUnsaved(true)
        } else {
            alert("Somente são permitidos valores entre 0 e 9999.")
        }
    }
    function increaseQuantity(name){
        if(Number(qtd[name]) < 10000) {
            setQtd(prevState => ({...prevState, [name]: (Number(qtd[name]) + 1).toString()}))
            setUnsaved(true)
        }
    }
    function decreaseQuantity(name){
        if(!(Number(qtd[name]) === 0)){
            setQtd(prevState => ({...prevState, [name]: (Number(qtd[name]) - 1).toString()}))
            setUnsaved(true)
        }

    }

    return (

        <FlatList

                  data={bloodType}
                  renderItem={({item}) => {
                      return (
                          <View style={{display: 'flex',paddingHorizontal: 20, height: 60, flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.13)', backgroundColor: 'white'}}>
                              <Text  > {item.name}</Text>
                             <View style={{display:'flex', flexDirection:'row', alignItems: 'center'}}>
                                 <Pressable
                                     onPress={() => increaseQuantity(item.name)}
                                     style={({pressed}) => [
                                         {
                                             backgroundColor: pressed ? 'rgba(204,204,204,0.27)' : 'white',
                                         },

                                     ]}

                                 >
                                     <MaterialCommunityIcons name={'plus'} size={15} color={'tomato'}  />

                                 </Pressable>
                                 <TextInput
                                     theme={{ colors: { onSurface: "black", primary: 'tomato'}}}
                                     style={[{width: 65, height: 30,   margin: 6,

fontSize: 12,
                                         fontFamily: 'SFRegular',
                                       textAlign: 'center',
                                         backgroundColor: "#00000010",
                                         color: "#3d3d3d",}]}
                                     value={qtd[item.name]}
                                     selectionColor= 'tomato'
                                     underlineColorAndroid="transparent"
                                     onChangeText={(e) => defineQuantity(e, item.name)}
                                     selectTextOnFocus={true}
                                     inputMode='numeric'
                                     underlineColor={'red'}
                                 />
                                 <Pressable
                                     onPress={() => decreaseQuantity(item.name)}
                                     style={({pressed}) => [
                                         {
                                             backgroundColor: pressed ? 'rgba(204,204,204,0.27)' : 'white',
                                         },

                                     ]}

                                 >
                                     <MaterialCommunityIcons name={'minus'} size={15} color={'tomato'}  />

                                 </Pressable>
                             </View>
                          </View>
                      )

                  }}
        />



)
}

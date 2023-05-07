import {TextInput, Text, View} from "react-native";
import {stylesAuth} from "./Authentication";
import {cnpjValidation} from "./ValidatorCNPJ";
import React, {useState} from "react";

export default function CustomInput({props}){
    const [isFocused, setIsFocused] = useState(false)
    return (
        <View style={{width: '100%', alignItems: 'center'}}>
    <TextInput
        theme={{ colors: { onSurface: "black"}}} mode="outlined"
        style={[stylesAuth.TextInputStyle, {borderColor: props.value.length === 0 ? 'transparent' : props.correct ? '#a2ce93' : '#eeaeae', borderWidth: isFocused ? 1 : 0}]}
        placeholderTextColor={"#00000050"}
        onFocus = {() => setIsFocused(true)}
        onBlur = {() => setIsFocused(false)}
        {...props}
    />
            <Text style={{
                width: '80%',
                color: props.value.length === 0 ? 'transparent' : 'red'  ,
                fontSize: 10,
                margin: 0
            }}>{!props.correct && props.errorText}</Text>
        </View>
    )
}
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
  } from "react-native";
  import { Calendar } from "react-native-calendars";
  import React, { useState } from "react";
  import { SelectList } from "react-native-dropdown-select-list";
  
  export default function DonationSchedule({ route, navigation }) {
    const { local } = route.params;
  
    const [selectedDate, setSelectedDate] = useState();
    const handleDayPress = (day) => {
      setSelectedDate(day.dateString);
    };
  
    const [selectedTime, setSelectedtime] = useState();
  
    const data = [
      { key: "6", value: "6:00" },
      { key: "7", value: "7:00" },
      { key: "8", value: "8:00" },
      { key: "9", value: "9:00" },
      { key: "10", value: "10:00" },
      { key: "11", value: "11:00" },
      { key: "12", value: "12:00" },
      { key: "13", value: "13:00" },
      { key: "14", value: "14:00" },
      { key: "15", value: "15:00" },
      { key: "16", value: "16:00" },
      { key: "17", value: "17:00" },
      { key: "18", value: "18:00" },
    ];
  
    return (
      <SafeAreaView
        style={{ backgroundColor: "white", width: "100%", height: "100%" }}
      >
        <Calendar
          onDayPress={handleDayPress}
          style={{ width: "100%" }}
          theme={{
            arrowColor: "rgba(255,68,68,0.8)",
            textSectionTitleColor: "rgba(255,68,68,0.8)",
            todayTextColor: "rgba(255,68,68,0.8)",
            selectedDayBackgroundColor: "rgba(255,68,68,0.8)",
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "rgba(255,68,68,0.8)",
            },
          }}
        />
        {/* {selectedDate ? (
          <Text
            style={{
              fontFamily: "SFRegular",
              marginVertical: 10,
              textAlign: "center",
              width: "95%",
              fontSize: 22,
            }}
          >
            Data selecionada:{" "}
            {`${selectedDate.split("-")[2]}/${selectedDate.split("-")[1]}/${
              selectedDate.split("-")[0]
            }`}
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: "SFRegular",
              marginVertical: 10,
              textAlign: "center",
              width: "95%",
              fontSize: 22,
            }}
          >
            Nenhuma data selecionada
          </Text>
        )} */}
  
        <Text
          style={{
            fontFamily: "SFRegular",
            marginVertical: 10,
            textAlign: "center",
            width: "95%",
            fontSize: 22,
          }}
        >
          Informe um horário:
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ width: "60%", marginBottom: "5%" }}>
            <SelectList setSelected={setSelectedtime} data={data} />
          </View>
          <TouchableOpacity
            style={{
              display: "flex",
              margin: "auto",
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,68,68,0.8)",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Text>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
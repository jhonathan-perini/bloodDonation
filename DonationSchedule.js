import {ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View,} from "react-native";
import {Calendar} from "react-native-calendars";
import React, {useContext, useEffect, useState} from "react";
import {LocaleConfig} from "react-native-calendars/src/index";
import {useMutation, useQuery, useQueryClient} from "react-query";
import api from "./api";
import TabContext from "./TabContext";
import {auth} from "./firebaseConfig";


export default function DonationSchedule({ route, navigation }) {
    const { local } = route.params;

      LocaleConfig.locales['br'] = {

          monthNames: [
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro'
          ],
          monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
          dayNamesShort: ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          today: "Hoje"
      };
      LocaleConfig.defaultLocale = 'br';
    const [selectedDate, setSelectedDate] = useState();
    const handleDayPress = (day) => {
      setSelectedDate(day.dateString);

    };
  
    const [selectedTime, setSelectedtime] = useState();
      Date.prototype.addDays = function(days) {
          let date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
      }
const client = useQueryClient()
      const saveSchedule = useMutation(async(args) => {
          return await api.patch(`/schedule/${args.cnpj}`, args)
      }, {
          onSuccess: async () => {
              alert('Agendamento realizado.')
              await client.invalidateQueries('SCHEDULE_LOCAL')
              await client.invalidateQueries('USER_DONATIONS')
              setSelectedDate(null)
              setSelectedtime(null)
              navigation.navigate('ScheduleConfirmation')
          }
      })


      const initialTime = [
          { key: "6", value: "06:00" },
          { key: "7", value: "07:00" },
          { key: "8", value: "08:00" },
          { key: "9", value: "09:00" },
          { key: "10", value: "10:00" },
          { key: "11", value: "11:00" },
          { key: "12", value: "12:00" },
          { key: "13", value: "13:00" },
          { key: "14", value: "14:00" },
          { key: "15", value: "15:00" },
          { key: "16", value: "16:00" },
          { key: "17", value: "17:00" },
          { key: "18", value: "18:00" },
      ]
  const [data, setData] = useState( initialTime )
const [markedDate, setMarkedDates] = useState({})

const {data: scheduleLocal} = useQuery(['SCHEDULE_LOCAL'], async() => {
    if(local?.cnpj) {
        const response = await api.get(`/schedule/${local?.cnpj}`)
        const days = response.data[0]?.schedule?.map(day => day.date)
        // alert(JSON.stringify(days))
        const counts = {};
        const marked = {}
        for (const num of days) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
            if(counts[num] === initialTime.length) marked[num]={  disableTouchEvent: true, disabled: true}
        }



        setMarkedDates(marked)

        return response.data
    }
})
      const context = useContext(TabContext)
      const numColumns = Math.ceil(initialTime.length / 4);
      useEffect(() => {
          if(selectedDate) {
              const daySchedule = scheduleLocal[0]?.schedule?.filter(day => day.date === selectedDate)
              const hours = daySchedule?.map(key => key.hour)
              const final = initialTime?.filter(item => !hours?.includes(item.key))
              setData(final ? final : initialTime)

          }
      }, [selectedDate, scheduleLocal])

      useEffect(() => {
          saveSchedule.isLoading && context.setOverlay(true)
          !saveSchedule.isLoading && context.setOverlay(false)
      }, [saveSchedule.isLoading])

      const user = client.getQueryData('USER_TYPE')


    return (
        <>





      <SafeAreaView
        style={{ backgroundColor: "white", width: "100%", height: "100%" }}
      >
          {saveSchedule.isLoading &&  <ActivityIndicator size="large" style={{position: 'absolute', alignSelf:'center', top: '40%', zIndex: 3}} color="#000" />}
          <Text style={{fontFamily: 'SFBold', fontSize: 24, textAlign: 'center', marginVertical: 18}}>Escolha o dia da sua doação</Text>
        <Calendar
          onDayPress={handleDayPress}
          style={{ width: "100%" }}

          minDate={new Date().addDays(2).toDateString().split('T')[0]}
          maxDate={new Date().addDays(32).toDateString().split('T')[0]}
          theme={{
            arrowColor: "rgba(255,68,68,0.8)",
            textSectionTitleColor: "rgba(255,68,68,0.8)",
            todayTextColor: "rgba(255,68,68,0.8)",
            selectedDayBackgroundColor: "rgba(255,68,68,0.8)",
          }}
          markedDates={
              {
                  [selectedDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: "rgba(255,68,68,0.8)",
                  },
                  ...markedDate
              }
        }


        />



        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
            {selectedDate?.length > 0 &&<View style={{width: "80%", marginBottom: '5%'}}>
                <Text
                    style={{fontFamily: 'SFBold', fontSize: 24, textAlign: 'center', marginVertical: 16}}>
                    Agora o horário
                </Text>
                <FlatList
                    contentContainerStyle={{alignSelf: 'flex-start', width: '100%'}}
                    numColumns={numColumns}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    renderItem={({item, index}) => {
                        return <TouchableOpacity
                            color={"#841584"}
                            style={{
                                padding: 8,
                                width: '23%',
                                borderWidth: selectedTime === item.key ? 0 : 1,
                                marginRight: 4,
                                marginBottom: 4,
                                borderColor: '#dcdcdc',
                                borderRadius: 8,
                                backgroundColor: selectedTime === item.key ? "rgba(255,68,68,0.8)" : 'white',
                            }}
                            onPress={() => setSelectedtime(item.key)}
                        >
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: 'SFRegular',
                                color: selectedTime === item.key ? "white" : 'black'
                            }}>{item.value}</Text>
                        </TouchableOpacity>
                    }}
                />


            </View>}
          <TouchableOpacity
            style={{
              display: "flex",
              margin: "auto",
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (selectedDate?.length > 0) && (selectedTime?.length > 0) ?"rgba(255,68,68,0.8)" : '#d0d0d0'  ,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            onPress={() => saveSchedule.mutate({selectedDate, selectedTime, cnpj: local?.cnpj, data: {local, user }})}
            disabled={!(selectedDate?.length > 0 && selectedTime?.length > 0)}
          >
            <Text  style={{ fontFamily: 'SFBold', color:(selectedDate?.length > 0 && selectedTime?.length > 0) ? "white" : 'black'}}>Continuar</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
            </>
    );
  }
  
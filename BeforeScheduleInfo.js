import {Text, ScrollView, TouchableOpacity, View, Image} from 'react-native'
import {stylesAuth} from "./Authentication";
import {disc} from "@jsamr/counter-style/presets";
import MarkedList from "@jsamr/react-native-li";
import Checkbox from 'expo-checkbox';
import {useState} from "react";
import checkMark from "./assets/checkmark.png";
import block from "./assets/ad-blocker.png";
import warning from "./assets/warning.png";
export default function BeforeScheduleInfo({navigation}){
    const [check, setCheck] = useState(false)
        const info = ["Ter idade entre 16 e 69 anos, desde que a primeira doação tenha sido feita até 60 anos (menores de 18 anos devem possuir consentimento formal do responsável legal); Pessoas com idade entre 60 e 69 anos só poderão doar sangue se já o tiverem feito antes dos 60 anos.",
        "Apresentar documento de identificação com foto emitido por órgão oficial (Carteira de Identidade, Carteira Nacional de Habilitação, Carteira de Trabalho, Passaporte, Registro Nacional de Estrangeiro, Certificado de Reservista e Carteira Profissional emitida por classe), serão aceitos documentos digitais com foto.",
            "Pesar no mínimo 50 kg.",
            "Ter dormido pelo menos 6 horas nas últimas 24 horas.",
            "Estar alimentado. Evitar alimentos gordurosos nas 3 horas que antecedem a doação de sangue. Caso seja após o almoço, aguardar 2 horas.",
            "Pessoas com idade entre 60 e 69 anos só poderão doar sangue se já o tiverem feito antes dos 60 anos.",
            "A frequência máxima é de quatro doações de sangue anuais para o homem e de três doações de sangue anuais para as mulher.",
            "O intervalo mínimo entre uma doação de sangue e outra é de dois meses para os homens e de três meses para as mulheres.",
        ]

        const warnings = ["Ter passado por um quadro de hepatite após os 11 anos de idade",
        "Evidência clínica ou laboratorial das seguintes doenças transmissíveis pelo sangue: Hepatites B e C, AIDS (vírus HIV), doenças associadas ao vírus HTLV I e II e Doenças de Chagas",
            "Uso de drogas ilícitas injetáveis",
            "Malária"
        ]

        const abc = ["Gripe, resfriado e febre: aguardar 7 dias após o desaparecimento dos sintomas",
            "Período gestacional",
            "Período pós-gravidez: 90 dias para parto normal e 180 dias para cesariana",
            "Amamentação: até 12 meses após o parto",
            "Ingestão de bebida alcoólica nas 12 horas que antecedem a doação",
            "Tatuagem e/ou piercing nos últimos 12 meses (piercing em cavidade oral ou região genital impedem a doação)",
            "Extração dentária: 72 horas",
            "Apendicite, hérnia, amigdalectomia, varizes: 3 meses",
            "Colecistectomia, histerectomia, nefrectomia, redução de fraturas, politraumatismos sem seqüelas graves, tireoidectomia, colectomia: 6 meses",
            "Transfusão de sangue: 1 ano",
            "Vacinação: o tempo de impedimento varia de acordo com o tipo de vacina",
            "Exames/procedimentos com utilização de endoscópio nos últimos 6 meses",
            "Ter sido exposto a situações de risco acrescido para infecções sexualmente transmissíveis (aguardar 12 meses após a exposição).",

            ]

    return (
        <ScrollView style={{paddingRight: 20, paddingLeft: 10, backgroundColor: 'white'}}>
            <Text style={[stylesAuth.RegisterText, {marginVertical: 10}]}>Para a doação de sangue, é preciso atender alguns critérios.</Text>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10 ,   shadowColor: '#171717',
                shadowOffset: {width: -1, height: 0},
                shadowOpacity: 0.15,
                shadowRadius: 3, }}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={checkMark} style={{width: 20, height: 20, marginRight: 5}}/>
                    <Text style={[stylesAuth.LoginText, {marginVertical: 10, color: 'black'}]}>Requisitos</Text>
                </View>

                <MarkedList counterRenderer={disc} >
                    {info.map((value, index) => (
                        <Text key={index} style={[{ flexShrink: 1, fontFamily: 'SFRegular', lineHeight: 20, textAlign: 'justify'}]}>
                            {value}
                        </Text>
                    ))}
                </MarkedList>
            </View>
            <Text style={[stylesAuth.RegisterText, {marginVertical: 10}]}>Há, também, alguns impedimentos temporários.</Text>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10 , marginBottom:10,  shadowColor: '#171717',
                shadowOffset: {width: -1, height: 0},
                shadowOpacity: 0.15,
                shadowRadius: 3, }}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={warning} style={{width: 20, height: 20, marginRight: 5}}/>
                    <Text style={[stylesAuth.RegisterText, {marginVertical: 10,color: 'black'}]}>Impedimentos temporários</Text>
                </View>
                <MarkedList counterRenderer={disc}>
                    {abc.map((value, index) => (
                        <Text key={index} style={[{ flexShrink: 1, fontFamily: 'SFRegular', lineHeight: 20, textAlign: 'justify'}]}>
                            {value}
                        </Text>
                    ))}
                </MarkedList>
            </View>
            <Text style={[stylesAuth.RegisterText, {marginVertical: 10}]}>Caso você tenha vivenciado um dos cenários abaixo, infelizmente não será possivel prosseguir com sua doação.</Text>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10 ,   shadowColor: '#171717',
                shadowOffset: {width: -1, height: 0},
                shadowOpacity: 0.15,
                shadowRadius: 3, }}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={block} style={{width: 20, height: 20, marginRight: 5}}/>
                    <Text style={[stylesAuth.RegisterText, {marginVertical: 10,color: 'black'}]}>Impedimentos definitivos</Text>
                </View>
                <MarkedList counterRenderer={disc}>
                    {warnings.map((value, index) => (
                        <Text key={index} style={[{ flexShrink: 1, fontFamily: 'SFRegular', lineHeight: 20, textAlign: 'justify'}]}>
                            {value}
                        </Text>
                    ))}
                </MarkedList>
            </View>


            <View style={{display: 'flex', flexDirection: 'row', marginVertical: 10}}>
                <Checkbox
                    disabled={false}
                    value={check}
                    onValueChange={setCheck}
                />
                <Text style={{marginLeft: 5, fontFamily: 'SFRegular'}}>Li e confirmo que atendo a todos os critérios.</Text>
            </View>

                <TouchableOpacity
            disabled={!check}
            onPress={() => navigation.navigate('DonationLocal')}
                    style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        justifyContent: 'center',
            backgroundColor: check ? "rgba(255,68,68,0.8)": '#b2b2b2',
                            borderRadius: 10,
                            padding: 10,
                        marginBottom: 10,

                   
                    }}>
                        <Text style={{  color: 'white'}}  >Continuar</Text>
                </TouchableOpacity>
        </ScrollView>

    )
}






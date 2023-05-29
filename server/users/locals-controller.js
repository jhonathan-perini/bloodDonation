import {MONGO_CLIENT} from "../db.js";
import axios from "axios";
import {ObjectId} from "mongodb";


const USERS_COLLECTION = MONGO_CLIENT.collection('users')
const SCHEDULE_COLLECTION = MONGO_CLIENT.collection('schedule')

export async function findLocals(req, res) {
    const body = req.body
    const response = await USERS_COLLECTION.aggregate([
        {
            '$match': {
                'cnpj': {
                    '$exists': true
                },
                'cep': {
                    '$exists': true
                },
                '$expr': {
                    '$gte': [
                        {
                            '$strLenCP': '$cep'
                        }, 8
                    ]
                }
            }
        }
    ]).toArray()
    const ceps = []
    const destinations = response?.map(dest => { ceps.push(dest.cep);  return `${dest.street} ${dest.number} ${dest.city},`})

    const origin = `${body.street} ${body.number} ${body.city}`

    const responseAxios = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.replaceAll(' ', '+')}&destinations=${destinations.map(dest2 => dest2.replaceAll(' ', '+').replaceAll(',', '|'))}&mode=driving&language=pt-BR&sensor=false&key=AIzaSyC0AIyymf7G-in8Pie_B7GkbVFzJjdjVYE
`, {baseURL: ''})
    console.log(JSON.stringify(responseAxios.data))
    responseAxios.data.rows[0].elements?.forEach((value, index) => {
        responseAxios.data.rows[0].elements[index].cep = ceps[index]
        responseAxios.data.rows[0].elements[index].address = destinations[index].replace(',', '')
        responseAxios.data.rows[0].elements[index].name = response[index].name
        responseAxios.data.rows[0].elements[index].cnpj = response[index].cnpj
        responseAxios.data.rows[0].elements[index].supply = response[index]?.supply
    })
    console.log(responseAxios.data.rows[0].elements)

    res.status(200).send(responseAxios.data.rows[0].elements?.length >1 ? responseAxios.data.rows[0].elements.sort((a, b) => {
        return a.distance.value - b.distance.value;
    }) : responseAxios.data.rows[0].elements)
    console.log(ceps)



}

export async function scheduleDonation(req, res){
    const schedule = req.body
    console.log(JSON.stringify(schedule))
    await USERS_COLLECTION.updateOne({cnpj: schedule?.cnpj}, {$addToSet: {schedule: {date: schedule.selectedDate, hour: schedule.selectedTime, data: schedule.data, status: 'scheduled'}}})


    res.status(200).send()

}


export async function getSchedule(req, res){
    const schedule = req.params.id
    const response = await USERS_COLLECTION.find({cnpj: schedule}).toArray()

    res.status(200).send(response)

}

export async function deleteSchedule(req, res){
    const cnpj = req.params.id
    const {delItem} = req.body
     await USERS_COLLECTION.updateOne({cnpj}, {$pull: {schedule: {date: delItem.date, hour: delItem.hour} }})

    res.status(200).send()

}
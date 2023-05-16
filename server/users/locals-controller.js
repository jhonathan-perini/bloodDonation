import {MONGO_CLIENT} from "../db.js";
import axios from "axios";


const USERS_COLLECTION = MONGO_CLIENT.collection('users')

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
    responseAxios.data.rows[0].elements?.forEach((value, index) => {
        responseAxios.data.rows[0].elements[index].cep = ceps[index]
        responseAxios.data.rows[0].elements[index].address = destinations[index].replace(',', '')
        responseAxios.data.rows[0].elements[index].name = response[index].name
        responseAxios.data.rows[0].elements[index].cnpj = response[index].cnpj
    })
    console.log(responseAxios.data.rows[0].elements)

    res.status(200).send(responseAxios.data.rows[0].elements?.length >1 ? responseAxios.data.rows[0].elements.sort((a, b) => {
        return a.distance.value - b.distance.value;
    }) : responseAxios.data.rows[0].elements)
    console.log(ceps)



}
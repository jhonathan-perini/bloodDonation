import {MONGO_CLIENT} from "../db.js";


const USERS_COLLECTION = MONGO_CLIENT.collection('users')

export async function createUser(req, res) {
   await USERS_COLLECTION.insertOne(req.body)
    res.status(200).send()

}

export async function findPartner(req, res) {
    const cnpj = req.params.id.trim()
   const response =  await USERS_COLLECTION.findOne({cnpj})
    res.status(200).send(response)

}
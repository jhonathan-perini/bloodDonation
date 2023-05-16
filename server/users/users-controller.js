import {MONGO_CLIENT} from "../db.js";
import {ObjectId} from "mongodb";


const USERS_COLLECTION = MONGO_CLIENT.collection('users')

export async function updateUser(req, res) {
    let id = req.params.id
    const body = req.body
    delete body?._id
    await USERS_COLLECTION.updateOne({_id: new ObjectId(id)}, {$set: body})
    res.status(200).send()

}


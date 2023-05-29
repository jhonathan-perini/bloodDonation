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

export async function getDonations(req, res) {
    let id = req.params.id

    let response = await USERS_COLLECTION.find({"schedule.data.user.email": id}).toArray()
    const novo = []
    if(response?.length > 0){
        response.forEach(item => {
            item?.schedule.forEach(sc => {
                sc?.data?.user?.email === id && novo.push({date: sc.date, hour: sc.hour, local: sc.data.local, user: sc.data.user, _id: item._id, status: sc.status})
            })
        })
        novo.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        })
    }
console.log(novo)
    res.status(200).send(novo)

}
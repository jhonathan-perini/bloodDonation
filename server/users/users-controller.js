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

export async function getDonationsLocal(req, res) {
    let id = req.params.id

    let response = await USERS_COLLECTION.find({"email": id}).toArray()
    const novo = []
    if(response?.length > 0){
        response.forEach(item => {
            item?.schedule.forEach(sc => {
                novo.push({date: sc.date, hour: sc.hour, local: sc.data.local, user: sc.data.user, _id: item._id, status: sc.status})
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

export async function sendNotification(req, res) {
    let data = req.body

   await USERS_COLLECTION.updateOne({"email": data.email}, {$addToSet: {notifications: {_id: new ObjectId() ,status: 'unseen', message: data.message, dateCreated: new Date(), date: data.date, local: data.local, hour: data.hour}}})

    res.status(200).send()

}

export async function sendNotificationAll(req, res) {
    let data = req.body

    await USERS_COLLECTION.updateMany({"cnpj": {$exists: false}}, {$addToSet: {notifications: {_id: new ObjectId() ,status: 'unseen', message: data.message, dateCreated: new Date(), type: 'request'}}})

    res.status(200).send()

}
export async function getNotifications(req, res) {
    let id = req.params.id

    const response = await USERS_COLLECTION.find({"email": id}).toArray()
    console.log(JSON.stringify(response))

    res.status(200).send(response[0]?.notifications)

}

export async function changeNotifications(req, res) {
    let id = req.params.id?.split(`+`)
    let email = id[0]
    let id3 = id[1]

    await USERS_COLLECTION.updateOne({email}, {$set: {"notifications.$[elem].status": 'viewed'}}, {arrayFilters: [{"elem._id": new ObjectId(id3)}]} )


    res.status(200).send()

}

export async function updateStatus(req, res) {
    let id = req.params.id?.split(`+`)
    let cnpj = id[0]
    let date = id[1]
    let hour = id[2]

    await USERS_COLLECTION.updateOne({cnpj}, {$set: {"schedule.$[elem].status": 'done'}}, {arrayFilters: [{"elem.date": date, "elem.hour": hour}]} )


    res.status(200).send()

}
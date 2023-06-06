import {Router} from "express";
import {createUser, findPartner, findUser} from "./auth-partner-controller.js";
import {
    changeNotifications,
    getDonations,
    getDonationsLocal,
    getNotifications,
    sendNotification, sendNotificationAll, updateStatus,
    updateUser
} from "./users-controller.js";

const usersRouter = Router()


usersRouter.route('/user/:id').patch(updateUser)
usersRouter.route('/user').post(createUser)
usersRouter.route('/donations/:id').get(getDonations).patch(updateStatus)
usersRouter.route('/donations-local/:id').get(getDonationsLocal)
usersRouter.route('/notify').post(sendNotification)
usersRouter.route('/notifyAll').post(sendNotificationAll)
usersRouter.route('/notifications/:id').get(getNotifications).patch(changeNotifications)




export default usersRouter
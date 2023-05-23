import {Router} from "express";
import {deleteSchedule, findLocals, getSchedule, scheduleDonation} from "./locals-controller.js";

const localsRouter = Router()


localsRouter.route('/locals').post(findLocals)

localsRouter.route('/schedule/:id').get(getSchedule).patch(scheduleDonation)
localsRouter.route('/del-schedule/:id').patch(deleteSchedule)




export default localsRouter
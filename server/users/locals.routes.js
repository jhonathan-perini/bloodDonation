import {Router} from "express";
import {findLocals, getSchedule, scheduleDonation} from "./locals-controller.js";

const localsRouter = Router()


localsRouter.route('/locals').post(findLocals)
localsRouter.route('/schedule').post(scheduleDonation)
localsRouter.route('/schedule/:id').get(getSchedule)




export default localsRouter
import {Router} from "express";
import {createUser, findPartner, findUser} from "./auth-partner-controller.js";
import {updateUser} from "./users-controller.js";
import {findLocals} from "./locals-controller.js";

const localsRouter = Router()


localsRouter.route('/locals').post(findLocals)




export default localsRouter
import {Router} from "express";
import {createUser, findPartner} from "./auth-partner-controller.js";

const authRouter = Router()

authRouter.route('/create-partner').post(createUser)
authRouter.route('/partner/:id').get(findPartner)


export default authRouter
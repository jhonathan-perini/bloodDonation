import {Router} from "express";
import {createUser, deleteUser, findPartner, findUser} from "./auth-partner-controller.js";

const authRouter = Router()

authRouter.route('/create-partner').post(createUser)
authRouter.route('/delete-partner').post(deleteUser)
authRouter.route('/partner/:id').get(findPartner)
authRouter.route('/find-user/:id').get(findUser)


export default authRouter
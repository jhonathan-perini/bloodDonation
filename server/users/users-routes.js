import {Router} from "express";
import {createUser, findPartner, findUser} from "./auth-partner-controller.js";
import {updateUser} from "./users-controller.js";

const usersRouter = Router()


usersRouter.route('/user/:id').patch(updateUser)
usersRouter.route('/user').post(createUser)



export default usersRouter
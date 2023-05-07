import express from 'express'
import cors from 'cors'
import compression from 'compression'
import authRouter from "./users/auth.partner-routes.js";


const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(compression())

app.use('/api/v1', authRouter)

export default app
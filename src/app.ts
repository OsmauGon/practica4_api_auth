import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express()

app.use(express.json())//middleware para manejar JSON

//ROUTES
//autorizacion
app.use('/auth', authRoutes)// Vincular las rutas al prefijo /auth
//user
app.use('/users', userRoutes)

console.log("La consola fue limpiada")
console.log("Todo funciona por el momento")


export default app
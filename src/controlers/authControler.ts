import { Request, Response } from "express"
import { comparePassword, hashPassword } from "../services/password.service"
import prisma from '../models/user'
import { generateToken } from "../services/auth.service"
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export const register = async( req :Request, res :Response
    ) :Promise<void>=>{

    const {email, password} = req.body

    try {
        if(!email) throw new Error('El email es obligatiorio')
        if(!password) throw new Error('El password es obligatiorio')

        const hashedPassword = await hashPassword(password)
        console.log('Registro almacenado con la clave: ' + hashedPassword)

        const user = await prisma.create(
            {
                data:{
                    email: email,
                    password: hashedPassword
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {
        //TODO profundizar mas en los errores
        if(!email){
            res.status(400).json({message: "Ingresar un email es obligatorio"})
        }
        if(!password){
            res.status(400).json({message: "Ingresar un password es obligatorio"})
        }
        
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message: 'El email ingresado ya existe'})
        }

        //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
        console.log(error)
        res.json({error: 'Hubo un error en el registro'})
    }
}
export const login = async( req :Request, res :Response
) :Promise<void>=>{
    
    const { email, password } = req.body;

    try {
        if(!email) throw new Error('El email es obligatiorio')
        if(!password) throw new Error('El password es obligatiorio')

        const user = await prisma.findUnique({where:{email: email}})
        //const user = await prisma.findUnique({ where: {email}}) tambien sirve
        // me olvide del await y me causo muchos problemas
        if(!user){
            res.status(404).json({error: 'Usuario no encontrado'})
            return
        }
        const passwordMatch = await comparePassword(password, user.password)
        
        if(!passwordMatch){
            res.status(401).json({message: 'usuario o contraseña incorrecto'})
        }

        const token = generateToken(user)
        res.status(200).json({token})
    } catch (error) {
        
    }
    
}
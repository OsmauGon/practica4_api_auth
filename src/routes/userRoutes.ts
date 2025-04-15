import express, { NextFunction,Request, Response } from 'express'
import jwt  from 'jsonwebtoken'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controlers/userControler'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//middleware de JWT para si estamos autenticados

const autenticationToken = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers['authorization']    

    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token){
       return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decode)=>{
       if(err){
           console.error('Error en la autenticacion', err)
           return res.status(403).json({error:'No tiene acceso a este recurso'})
       }
       
       next() 
    })
                        
}
router.post('/',createUser)
router.get('/',getAllUsers)
router.get('/:id',getUserById)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)


export default router 
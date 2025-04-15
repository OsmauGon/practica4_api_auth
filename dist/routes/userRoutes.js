"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userControler_1 = require("../controlers/userControler");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
//middleware de JWT para si estamos autenticados
const autenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decode) => {
        if (err) {
            console.error('Error en la autenticacion', err);
            return res.status(403).json({ error: 'No tiene acceso a este recurso' });
        }
        next();
    });
};
router.post('/', userControler_1.createUser);
router.get('/', userControler_1.getAllUsers);
router.get('/:id', userControler_1.getUserById);
router.put('/:id', userControler_1.updateUser);
router.delete('/:id', userControler_1.deleteUser);
exports.default = router;

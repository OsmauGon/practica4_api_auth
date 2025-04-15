"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const password_service_1 = require("../services/password.service");
const user_1 = __importDefault(require("../models/user"));
const auth_service_1 = require("../services/auth.service");
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = req.body;
    try {
        if (!email)
            throw new Error('El email es obligatiorio');
        if (!password)
            throw new Error('El password es obligatiorio');
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        console.log('Registro almacenado con la clave: ' + hashedPassword);
        const user = yield user_1.default.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });
        const token = (0, auth_service_1.generateToken)(user);
        res.status(201).json({ token });
    }
    catch (error) {
        //TODO profundizar mas en los errores
        if (!email) {
            res.status(400).json({ message: "Ingresar un email es obligatorio" });
        }
        if (!password) {
            res.status(400).json({ message: "Ingresar un password es obligatorio" });
        }
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ message: 'El email ingresado ya existe' });
        }
        //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
        console.log(error);
        res.json({ error: 'Hubo un error en el registro' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email)
            throw new Error('El email es obligatiorio');
        if (!password)
            throw new Error('El password es obligatiorio');
        const user = yield user_1.default.findUnique({ where: { email: email } });
        //const user = await prisma.findUnique({ where: {email}}) tambien sirve
        // me olvide del await y me causo muchos problemas
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        const passwordMatch = yield (0, password_service_1.comparePassword)(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'usuario o contraseña incorrecto' });
        }
        const token = (0, auth_service_1.generateToken)(user);
        res.status(200).json({ token });
    }
    catch (error) {
    }
});
exports.login = login;

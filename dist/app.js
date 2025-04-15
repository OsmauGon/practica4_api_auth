"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); //middleware para manejar JSON
//ROUTES
//autorizacion
app.use('/auth', authRoutes_1.default); // Vincular las rutas al prefijo /auth
//user
app.use('/users', userRoutes_1.default);
console.log("La consola fue limpiada");
console.log("Todo funciona por el momento");
exports.default = app;

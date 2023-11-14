const { body } = require('express-validator');

// Middleware de validación y sanitización de datos para el registro
const registrationValidation = [
    body('username').isLength({ min: 1 }).withMessage('El nombre de usuario es obligatorio'),
    body('password').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
];

module.exports = { registrationValidation }
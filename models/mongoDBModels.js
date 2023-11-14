const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose


const notesSchema = new Schema({
    idnota: { type: String },
    title: { type: String },
    note: { type: String },
    fecha: { type: String },
    creador: { type: String },
    estacion: { type: String },
});


const notesResolvedSchema = new Schema({
    title: { type: String },
    fecha: { type: String },
    creador: { type: String },
    estacion: { type: String },
});


const userSchema = new Schema({
    timestamp: { type: Number },
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean },
});


userSchema.pre('save', function (next) {
    const user = this;

    // Si la contraseña no se ha modificado, sigue adelante
    if (!user.isModified('password')) {
        return next();
    }

    // Genera un hash para la contraseña
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});


const noteModel = model('Notes', notesSchema)
const userModel = model('User', userSchema)
const noteResolvedModel = model('NotesResolved', notesResolvedSchema)


module.exports = { noteModel, userModel, noteResolvedModel }
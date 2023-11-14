const { noteModel, noteResolvedModel, userModel } = require("../models/mongoDBModels")
const logger = require('../log/log4js')
const bcrypt = require('bcrypt')

class mongoDBDAO {

    //___USER__//

    addUser = async (userToAdd) => {
        const user = new userModel(userToAdd);
        await user.save();
    };

    getUsers = async () => await userModel.find({});

    checkUser = async (username, password) => {
        try {
            const userExist = await userModel.findOne({ username: username })
            if (userExist !== null) {
                if (bcrypt.compareSync(password, userExist.password)) {
                    return { msg: 'Usuario y contrasena correctos', result: true }
                } else {
                    logger.info(`Se ha intentado logear ${username} con una contrasena incorrecta`)
                    return { msg: 'Contrasena incorrecta', result: false }
                }
            }
            return { msg: 'No existe usuario', result: false }
        } catch (err) {
            logger.error(`Error: ${err}`)
        }
    }

    async getUserBy(username) {
        try {
            const userExiste = await userModel.findOne({ username: username })
            return userExiste ? userExiste : null
        } catch (err) {
            logger.error(`Error: ${err} al intentar recuperar el usuario id:${username} de la base de datos`)
            return null
        }
    }

    deleteUser = async (id) => await userModel.deleteOne({ _id: id });

    updateUser = async (id, userToUpdate) => {
        return await userModel.updateOne(
            { _id: id },
            { $set: { ...userToUpdate } }
        );
    };

    //___note___//

    saveNote = async (noteToAdd) => {
        const note = new noteModel(noteToAdd);
        await note.save();
        console.log("guardado", note)
    };

    getNotes = async () => await noteModel.find({});

    saveResolvedNote = async (noteToAdd) => {
        const note = new noteResolvedModel(noteToAdd);
        await note.save();
        console.log("guardado", note)
    };

    getResolvedNotes = async () => await noteResolvedModel.find({});

    getNoteById = async (id) => await noteModel.findOne({ _id: id });

    getNoteResolvedById = async (id) => await noteResolvedModel.findOne({ _id: id });

    deleteNote = async (id) => await noteModel.deleteOne({ _id: id });

    deleteNoteResolved = async (limit) => {
        try {
            // Busca y selecciona las notas con la fecha más antigua (ascendente) hasta el límite especificado.
            const oldestNotes = await noteResolvedModel.find().sort({ fecha: 1 }).limit(limit);

            // Elimina las notas seleccionadas.
            await noteResolvedModel.deleteMany({ _id: { $in: oldestNotes.map(note => note._id) } });

            console.log(`Se eliminaron ${oldestNotes.length} notas más antiguas.`);
        } catch (error) {
            console.error('Error al eliminar notas:', error);
        }
    };

    deleteAllNotes = async () => await noteModel.deleteMany();

    updateNote = async (id, noteToUpdate) => {
        return await noteModel.updateOne(
            { _id: id },
            { $set: { ...noteToUpdate } }
        );
    };

}

module.exports = mongoDBDAO;

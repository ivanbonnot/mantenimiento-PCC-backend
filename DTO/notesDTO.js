const factoryDAO = require('../DAO/factory')

const notes = factoryDAO()


const addNewNoteDTO = async (note) => await notes.saveNote(note)

const getAllNotesDTO = async () => await notes.getNotes()

const addResolvedNoteDTO = async (note) => await notes.saveResolvedNote(note)

const getResolvedNotesDTO = async () => await notes.getResolvedNotes()

const getNoteByIdDTO = async (id) => await notes.getNoteById(id)

const getNoteResolvedByIdDTO = async (id) => await notes.getNoteResolvedById(id)

const updateNoteDTO = async (id, noteToUpdate) => await notes.updateNote(id, noteToUpdate)

const deleteNoteDTO = async (id) => await notes.deleteNote(id)

const deleteNoteResolvedDTO = async (limit) => await notes.deleteNoteResolved(limit)

const deleteAllNotesDTO = async () => await notes.deleteAllNotes()



module.exports = { getAllNotesDTO, getNoteByIdDTO, getNoteResolvedByIdDTO, addResolvedNoteDTO, getResolvedNotesDTO, deleteNoteDTO, deleteAllNotesDTO, deleteNoteResolvedDTO, addNewNoteDTO, updateNoteDTO }


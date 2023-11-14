const { getAllNotesDTO, getNoteByIdDTO, getNoteResolvedByIdDTO, addResolvedNoteDTO, getResolvedNotesDTO, deleteNoteDTO, deleteNoteResolvedDTO, addNewNoteDTO, updateNoteDTO } = require('../DTO/notesDTO')


const addNewNoteController = (NoteToAdd) => addNewNoteDTO(NoteToAdd)

const getAllNotesController = () => getAllNotesDTO()

const addResolvedNoteController = (NoteToAdd) => addResolvedNoteDTO(NoteToAdd)

const getResolvedNotesController = () => getResolvedNotesDTO()

const getNoteByIdController = (id) => getNoteByIdDTO(id)

const getNoteResolvedByIdController = (id) => getNoteResolvedByIdDTO(id)

const updateNoteController = (id, NoteToUpdate) => updateNoteDTO(id, NoteToUpdate)

const deleteNoteController = (id) => deleteNoteDTO(id)

const deleteNoteResolvedController = (limit) => deleteNoteResolvedDTO(limit)


module.exports = { addNewNoteController, getAllNotesController, addResolvedNoteController, getResolvedNotesController, getNoteByIdController, getNoteResolvedByIdController, deleteNoteController, updateNoteController, deleteNoteResolvedController }
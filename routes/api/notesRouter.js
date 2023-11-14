const { Router } = require("express");
const {
  addNewNoteController,
  getAllNotesController,
  addResolvedNoteController,
  getResolvedNotesController,
  getNoteByIdController,
  getNoteResolvedByIdController,
  deleteNoteController,
  deleteNoteResolvedController,
} = require("../../controllers/notesController");

const notesRouter = Router();
const { passport, isDeletedJWT } = require('../../middleware/auth')
const logger = require('../../log/log4js');
const moment = require('moment');

notesRouter.get("/notes", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const notes = await getAllNotesController();
    res.json({ notes });

  } catch (error) {
    logger.error(`Error en la solicitud de notes: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.get("/notes/:id", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { method, url } = req
  const { id } = req.params;

  try {
    const noteById = await getNoteByIdController(id);
    console.log(noteById)
    if (noteById) {
      res.json(noteById);
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. No existe la nota:${id}`);
      return res.status(403).json({ result: "error" });
    }

  } catch (error) {
    logger.error(`Error en la solicitud de nota por id: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.post("/notes", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {

    const { idnota, title, note, fecha, creador, estacion } = req.body;

    //const fecha = moment().format("MMMM Do YYYY, h:mm:ss a");
    const fechaISO8601 = moment(fecha, 'MMMM Do YYYY, h:mm:ss a').format();

    const notePost = {
      idnota,
      title,
      note,
      fecha: fechaISO8601,
      creador,
      estacion,
    };

    await addNewNoteController(notePost);
    res.json(notePost);

  } catch (error) {
    logger.error(`Error al crear nota: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.get("/notesresolved", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const notesResolved = await getResolvedNotesController();
    res.json({ notesResolved });

  } catch (error) {
    logger.error(`Error en la solicitud de notes: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.post("/notesresolved", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const { title, fecha, creador, estacion } = req.body;

    const noteResolved = {
      title: title,
      fecha: fecha,
      creador: creador,
      estacion: estacion,
    };

    console.log(noteResolved)
    await addResolvedNoteController(noteResolved);
    res.json(noteResolved);

  } catch (error) {
    logger.error(`Error al mover la nota: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.delete("/notes/:id", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { method, url } = req
  const { id } = req.params;

  try {
    const noteById = await getNoteByIdController(id);

    if (noteById) {
      await deleteNoteController(id);
      res.status(200).json({ deleted: true });
    } else {
      logger.error(`Ruta: ${url}, método: ${method}. No existe la nota:${id}`);
      return res.status(403).json({ result: "error" });
    }


  } catch (error) {
    logger.error(`Error al borrar la nota: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});


notesRouter.delete("/notesresolved/", isDeletedJWT, passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const notesResolved = await getResolvedNotesController();

    if (notesResolved.length >= 100) {
      for (let i = 100; i < notesResolved.length; i++) {
        await deleteNoteResolvedController(1);
      }
      res.status(200).json({ deleted: true });
    } else {
      res.status(204).json({ message: 'Las notas resueltas son menos de 100' });
    }

  } catch (error) {
    logger.error(`Error al borrar la nota: ${error}`);
    return res.status(500).json({ result: "error" });
  }
});

module.exports = notesRouter;

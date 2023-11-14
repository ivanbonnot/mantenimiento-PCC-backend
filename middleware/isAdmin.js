const { checkUserController, getUserController } = require("../controllers/usersControler");
let user = []
let useradm = {}

const isAdmin = async (req, res, next) => {
  try {

    user = await checkUserController(req.body.admusername, req.body.admpassword) //devuelve result: true

    if (user.result) {
      useradm = await getUserController(req.body.admusername)
    }

    if (user.result && useradm.admin === true) {
      // El usuario es un administrador
      next();
    } else {
      // El usuario no es un administrador
      return res.status(403).json({ message: 'Acceso prohibido para usuarios no administradores' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

};

module.exports = { isAdmin }
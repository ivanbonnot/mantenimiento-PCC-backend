const { checkUserDTO, getUserDTO, addUserDTO, updateUserDTO } = require('../DTO/usersDTO')


const checkUserController = (username, password) => checkUserDTO(username, password)

const getUserController = (username) => getUserDTO(username)

const newUserController = (user) => addUserDTO(user)

const updateUserController = (id, user) => updateUserDTO(id, user)


module.exports = { checkUserController, getUserController, newUserController, updateUserController }
const factoryDAO = require('../DAO/factory')

const users = factoryDAO()

const checkUserDTO = async( username, password ) => await users.checkUser( username, password );

const getUserDTO = async( username ) => await users.getUserBy( username );

const addUserDTO = async( user) =>  await users.addUser( user );

const updateUserDTO = async( id, userToUpdate ) => await users.updateUser( id, userToUpdate );


module.exports = { checkUserDTO, getUserDTO, addUserDTO, updateUserDTO }


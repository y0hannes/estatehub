const express = require('express')
const { registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  authenticateUser
} = require('../controllers/userController')

const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', authenticateUser, logoutUser)
router.get('/', authenticateUser, getUsers)
router.get('/:name', authenticateUser, getUser)
router.put('/:name', authenticateUser, updateUser)
router.delete('/:name', authenticateUser, deleteUser)

module.exports = router
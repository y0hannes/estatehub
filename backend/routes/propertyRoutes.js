const express = require('express')
const { authenticateUser } = require('../controllers/userController')
const { getProperties,
  getProperty,
  postProperty,
  updateProperty,
  deleteProperty } = require('../controllers/propertyController')

const router = express.Router()

router.get('/', getProperties)
router.get('/:id', getProperty)
router.post('/', authenticateUser, postProperty)
router.put('/:id', authenticateUser, updateProperty)
router.delete('/:id', authenticateUser, deleteProperty)

module.exports = router
const express = require('express')
const { getProperties,
  getProperty,
  postProperty,
  updateProperty,
  deleteProperty } = require('../controllers/propertyController')

const router = express.Router()

router.get('/', getProperties)
router.get('/:id', getProperty)
router.post('/', postProperty)
router.put('/:id', updateProperty)
router.delete('/:id', deleteProperty)

module.exports = router
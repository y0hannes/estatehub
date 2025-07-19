const express = require('express')
const { authenticateUser } = require('../controllers/userController')
const { getInteractions,
  createInteraction,
  deleteInteraction
} = require('../controllers/interactionController')

const router = express.Router()

router.get('/:id', getInteractions)
router.post('/:id', authenticateUser, createInteraction)
router.put('/:id', authenticateUser, createInteraction)
router.delete('/:id/:type', authenticateUser, deleteInteraction)

module.exports = router
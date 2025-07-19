const express = require('express')
const { authenticateUser } = require('../controllers/userController')
const { getInteractions,
  createInteraction,
  deleteInteraction
} = require('../controllers/interactionController')

const router = express.Router({ mergeParams: true })

router.get('', getInteractions)
router.post('', authenticateUser, createInteraction)
router.put('', authenticateUser, createInteraction)
router.delete('/:type', authenticateUser, deleteInteraction)

module.exports = router
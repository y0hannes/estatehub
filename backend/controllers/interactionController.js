const asyncHandler = require('express-async-handler')
const Interaction = require('../models/interactionModel')
const Property = require('../models/propertyModel')

const getInteractions = asyncHandler(async (req, res) => {
  const id = req.params.id
  const property = await Property.find({ id })
  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }
  const interactions = await Interaction.find({ property })
  res.status(200).json(interactions)
})

const createInteraction = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = req.user.id
  const { type, rating, content } = req.body

  if (type === 'rating' && (!rating || rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }
  if (type === 'comment' && !content) {
    return res.status(400).json({ message: 'Comment content is required' })
  }

  const property = await Property.findOne({ id })
  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }

  const interaction = await Interaction.findOneAndUpdate(
    { user, property, type },
    { rating, content },
    { upsert: true, new: true, runValidators: true }
  )

  if (type === 'rating') {
    const previousRating = interaction._id && interaction.rating ? interaction.rating : 0
    property.rating.totalRatingSum += rating - previousRating
    property.rating.ratingCount += previousRating ? 0 : 1
  }

  res.status(201).json(interaction)
})

const deleteInteraction = asyncHandler(async (req, res) => {
  const { id, type } = req.params
  const user = req.user.id

  const property = await Property.findOne({ id })
  if (!property) {
    return res.status(404).json({ message: 'Property not found' })
  }

  const interaction = await Interaction.findOneAndDelete({ user, property, type })
  if (!interaction) {
    return res.status(404).json({ message: 'Interaction not found' })
  }

  if (type === 'rating' && interaction.rating) {
    property.rating.totalRatingSum -= interaction.rating
    property.rating.ratingCount -= 1
    await property.save()
  }

  res.json({ message: 'Interaction deleted successfully' })
})

const getWishlist = asyncHandler(async (req, res) => {
  const user = req.user.id
  const type = 'wishlist'
  const wishlist = await Interaction.find({ user, type })
  .populate({
    path: 'property',
    select: 'title description price'
  })
  res.status(200).json(wishlist)
})

module.exports = { getInteractions, createInteraction, deleteInteraction, getWishlist }
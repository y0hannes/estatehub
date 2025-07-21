const Property = require('../models/propertyModel')

const getProperties = async (req, res) => {
  try {
    let filter = { isDeleted: false }

    for (const key in req.query) {

      const value = req.query[key]

      if (key === 'minPrice') {
        filter.price = { ...filter.price, $gte: parseFloat(value) }
      } else if (key === 'maxPrice') {
        filter.price = { ...filter.price, $lte: parseFloat(value) }
      }
      else if (key === 'minAreaSqFt') {
        filter['features.areaSqFt'] = { ...filter['features.areaSqFt'], $gte: parseFloat(value) }
      } else if (key === 'maxAreaSqFt') {
        filter['features.areaSqFt'] = { ...filter['features.areaSqFt'], $lte: parseFloat(value) }
      }
      else if (key === 'type' || key === 'status' || key === 'location.city' || key === 'location.subcity') {
        filter[key] = value
      }
      else if (key === 'features.bedrooms' || key === 'features.bathrooms') {
        filter[key] = parseInt(value)
      }
      else if (key === 'minRating') {
        filter['rating.averageRating'] = { ...filter['rating.averageRating'], $gte: parseFloat(value) };
      }
      else if (key === 'maxRating') {
        filter['rating.averageRating'] = { ...filter['rating.averageRating'], $lte: parseFloat(value) };
      }
    }

    let sort = {}
    let sortBy = req.query.sortBy
    let order = req.query.order

    if (!sortBy) {
      sortBy = 'createdAt',
        order = 'desc'
    }
    else {
      if (!order) {
        sortBy === 'price' ? order = 'asc' : 'desc'
      }
    }

    const sortOrder = (order == 'asc' ? 1 : -1)
    sort[sortBy] = sortOrder

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const totalDocuments = await Property.countDocuments(filter)

    res.status(200).json({ properties, totalDocuments, page, limit })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getProperty = async (req, res) => {
  try {
    const id = req.params.id
    const property = await Property.findOne({ id })
    if (!property || property.isDeleted) {
      return res.status(404).json({ msg: `property with id ${id} doesn't exist` })
    }
    return res.status(200).json(property)
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
}

const postProperty = async (req, res) => {
  const { title, description, price, location, type, features } = req.body
  try {
    const property = new Property({
      title,
      description,
      price,
      location,
      type,
      features,
      status: 'for sale',
      seller: req.user.id,
      image: req.file ? req.file.path : null,
      isDeleted: false
    })
    await property.save()
    res.status(201).json({ message: 'Property listed successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateProperty = async (req, res) => {
  try {
    const { title, description, price, location, type, features } = req.body
    const id = req.params.id
    const property = await Property.findOne({ id })
    if (!property || property.isDeleted) {
      return res.status(404).json({ errors: [{ msg: `property doesn't exist` }] })
    }
    if (!property.seller.equals(req.user.id)) {
      return res.status(403).json({ errors: [{ msg: 'Only Sellers can update' }] })
    }

    if (title) property.title = title
    if (description) property.description = description
    if (price) property.price = price
    if (location) property.location = location
    if (type) property.type = type
    if (features) property.features = features
    if (req.file) property.image = req.file.path

    await property.save()
    res.status(200).json(property)
  } catch (err) {
    console.error(err)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id
    const property = await Property.findOne({ id })
    if (!property || property.isDeleted) {
      return res.status(404).json({ errors: [{ msg: 'property not found' }] })
    }
    if (!property.seller.equals(req.user.id)) {
      return res.status(403).json({ errors: [{ msg: 'Only Sellers can update' }] })
    }
    property.isDeleted = true
    await property.save()
    res.status(200).json({ message: 'Property deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

module.exports = { getProperties, getProperty, postProperty, updateProperty, deleteProperty }
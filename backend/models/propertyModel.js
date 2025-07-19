const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        enum: ['Addis Abeba'],
      },
      subcity: {
        type: String,
        required: [true, 'Subcity is required'],
        enum: [
          'Addis Ketema',
          'Akaky Kaliti',
          'Arada',
          'Bole',
          'Gullele',
          'Kirkos',
          'Kolfe Keranio',
          'Lideta',
          'Nifas Silk-Lafto',
          'Yeka',
          'Lemi-Kura',
        ],
      },
      description: {
        type: String,
      },
    },
  type: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'land', 'commercial'],
    required: [true, 'Property type is required'],
  },
  features: {
    bedrooms: { type: Number, min: [0, 'Bedrooms cannot be negative'] },
    bathrooms: { type: Number, min: [0, 'Bathrooms cannot be negative'] },
    areaSqFt: { type: Number, min: [0, 'Area cannot be negative'] },
  },
  status: {
    type: String,
    enum: ['for sale', 'sold'],
    default: 'for sale'
  },
  // images: [{
  //   url: { type: String, required: [true, 'Image URL is required'] },
  //   publicId: { type: String },
  // }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
  },
  rating: {
  totalRatingSum: {
    type: Number,
    default: 0,
    min: [0, 'Total rating sum cannot be negative'],
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: [0, 'Rating count cannot be negative'],
  },
  averageRating: {
    type: Number,
    get: function () {
      return this.ratingCount > 0 ? (this.totalRatingSum / this.ratingCount).toFixed(1) : 0
    },
  },
},
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })


propertySchema.index({ title: 'text', description: 'text' })
propertySchema.index({ price: 1, status: 1 })

propertySchema.plugin(AutoIncrement, { inc_field: 'id' })

const Property = mongoose.model('Property', propertySchema)

module.exports = Property
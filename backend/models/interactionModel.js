const mongoose = require('mongoose')

const interactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  type: { 
    type: String, 
    enum: ['rating', 'comment'], 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: () => this.type === 'rating'
  },
  content: { 
    type: String, 
    trim: true, 
    required: () => this.type === 'comment' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true })

interactionSchema.index({ user: 1, property: 1, type: 1 }, { unique: true })

const Interaction = mongoose.model('interaction', interactionSchema)

module.exports = Interaction
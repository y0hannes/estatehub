
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer',
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'],
    required: function() { return this.role === 'seller'; },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

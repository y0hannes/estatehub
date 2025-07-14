const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()

let blacklistedTokens = []

const registerUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body

  try {
    let user = await User.findOne({ name })
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'buyer',
      phone,
    })

    await user.save()
    res.status(201).json({ message: 'User registered successfully' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const loginUser = async (req, res) => {
  const { name, password } = req.body
  try {
    const user = await User.findOne({ name })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    if (user && user.password === password) {
      const token = jwt.sign(name, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
      return res.json({ token })
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const logoutUser = async (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(400).json({ message: 'Access token required for logout' })
  }

  blacklistedTokens.push(token)
  res.json({ message: 'Logged out successfully' })

}

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token required' })
  }

  if (blacklistedTokens.includes(token)) {
    return res.status(403).json({ message: 'Token has been invalidated' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        blacklistedTokens = blacklistedTokens.filter(t => t !== token) // Clean up expired token
      }
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password')
    res.status(200).json(users)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = User.findById(id)
    if (!user || user.isDeleted) {
      return res.send(404).json({ error: [{ msg: `User with ${id} dosen't exist` }] })
    }
    res.send(200).json(user)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ error: [{ msg: 'Server error' }] })
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const id = req.params.id
    const user = User.findById(id)
    if (!user || user.isDeleted) {
      return res.send(404).json({ error: [{ msg: `User with ${id} dosen't exist` }] })
    }
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    if (phone) user.phone = phone

    await user.save()
    res.send(200).json(user)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ error: [{ msg: 'Server error' }] })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message: 'User deleted successfully' });
  }
  catch {
    console.log(err)
    res.status(500).json({ error: [{ msg: 'Server error' }] })
  }
}
module.exports = { registerUser, getUsers, getUser, updateUser, deleteUser, loginUser, logoutUser, authenticateUser }
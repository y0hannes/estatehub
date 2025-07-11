const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

const app = express()

connectDB()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to EstateHub')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

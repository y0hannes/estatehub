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

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/properties', require('./routes/propertyRoutes'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

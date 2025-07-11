const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    })

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB

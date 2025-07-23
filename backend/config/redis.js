const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

client.on('error', (err) => console.log('Redis Client Error', err))

const connectRedis = async () => {
  try {
    await client.connect()
    console.log('Redis client connected')
  } catch (err) {
    console.error('Failed to connect to Redis:', err)
  }
}

connectRedis()

module.exports = client

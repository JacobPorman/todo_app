import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION)
    console.log('Link Db success!')
  } catch (error) {
    console.log('Link Error', error)
    process.exit(1) // Exit with Error
  }
}
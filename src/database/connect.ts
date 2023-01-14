import mongoose from 'mongoose'

export const connectDatabase = async () => {
	mongoose.set('strictQuery', false)

	console.log('connecting to MongoDB...')
	await mongoose.connect(`${process.env.MONGODB_URI}`, () => {
		console.log('MongoDB connected!')
	})
}
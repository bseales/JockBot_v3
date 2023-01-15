import mongoose from 'mongoose'

export const connectDatabase = async () => {
	mongoose.set('strictQuery', false)

	console.log('connecting to MongoDB...')
	await mongoose.connect(`${process.env.MONGODB_URI}`, {
		dbName: process.env.MONGODB_DB_NAME
	}).then(() => {
		console.log('MongoDB connected!')
	}).catch(err => console.log(err))
}

export const connectDatabaseTesting = async () => {
	mongoose.set('strictQuery', false)

	console.log('connecting to MongoDB (TEST)...')
	await mongoose.connect(`${process.env.MONGODB_URI}`, {
		dbName: process.env.MONGODB_DB_TEST_NAME
	}).then(() => {
		console.log('MongoDB (TEST) connected!')
	}).catch(err => console.log(err))
}

export async function disconnectDBForTesting() {
	try {
		await mongoose.connection.close()
	} catch (error) {
		console.log('DB disconnect error')
	}
}
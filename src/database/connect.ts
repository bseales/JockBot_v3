import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let testMongo:MongoMemoryServer

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
	testMongo = await MongoMemoryServer.create()
	await mongoose.connect(`${testMongo.getUri()}`, {
		dbName: process.env.MONGODB_DB_TEST_NAME
	}).catch(err => console.log(err))
}

export const dropDB = async () => {
	await mongoose.connection.db.dropDatabase()
}

export async function disconnectDBForTesting() {
	try {
		await mongoose.connection.close()

		if (testMongo) {
			testMongo.stop()
		}
	} catch (error) {
		console.log('DB disconnect error')
	}
}
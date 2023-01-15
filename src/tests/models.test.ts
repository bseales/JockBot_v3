import { now } from 'mongoose'
import { connectDatabaseTesting, disconnectDBForTesting } from '../database/connect'
import UserModel, { UserInput } from '../database/models/user'
import dotenv from 'dotenv'

dotenv.config()

describe('MongoDB Models', () => {
	beforeAll(async () => {
		await connectDatabaseTesting()
	})

	describe('User', () => {
		it('create', async () => {
			const userInput: UserInput = {
				guildId: 'some guild id',
				userId: 'some user id',
				userName: 'some username',
				balance: 9999,
				lastClaimedAt: now(),
				bets: []
			}
			const user = new UserModel({ ...userInput })
			const createdUser = await user.save()
			expect(createdUser).toBeDefined()
			expect(createdUser.guildId).toBe(user.guildId)
			expect(createdUser.userId).toBe(user.userId)
			expect(createdUser.userName).toBe(user.userName)
			expect(createdUser.balance).toBe(user.balance)
			expect(createdUser.lastClaimedAt).toBe(user.lastClaimedAt)
			expect(createdUser.bets).toBe(user.bets)
		})
	})

	afterAll(async () => {
		await UserModel.collection.drop()
		await disconnectDBForTesting()
	})
})
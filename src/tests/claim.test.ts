/* eslint-disable @typescript-eslint/no-var-requires */
import Claim from '../commands/claim'
import UserModel, { UserDocument } from '../database/models/user'
import dotenv from 'dotenv'
import { User, ChatInputCommandInteraction } from 'discord.js'
import { connectDatabaseTesting, disconnectDBForTesting } from '../database/connect'
import mongoose from 'mongoose'

dotenv.config()

describe('Claim Command', () => {
	beforeAll(async () => {
		await connectDatabaseTesting()
	})

	afterAll(async () => {
		await disconnectDBForTesting()
	})
	it('Should get a random amount of bux between 1-20 for each claim', () => {
		const testSubject = new Claim()

		const amount1 = testSubject.getRandomClaimAmount()
		const amount2 = testSubject.getRandomClaimAmount()
		const amount3 = testSubject.getRandomClaimAmount()
		const amount4 = testSubject.getRandomClaimAmount()

		expect(amount1).toBeGreaterThanOrEqual(1)
		expect(amount1).toBeLessThanOrEqual(20)
		expect(amount2).toBeGreaterThanOrEqual(1)
		expect(amount2).toBeLessThanOrEqual(20)
		expect(amount3).toBeGreaterThanOrEqual(1)
		expect(amount3).toBeLessThanOrEqual(20)
		expect(amount4).toBeGreaterThanOrEqual(1)
		expect(amount4).toBeLessThanOrEqual(20)
	})

	it('Should update user record with the claimAmount', async () => {
		const testSubject = new Claim()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction

		testSubject.setInteraction(mockInteraction)
		const mockDiscordUser: User = ({
			id: '1',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User
		const lastClaimedDate = new Date()
		lastClaimedDate.setDate(lastClaimedDate.getDate() - 2)
	
		await UserModel.create({
			guildId: '987',
			userId: '1',
			userName: 'Mango',
			balance: 350,
			lastClaimedAt: lastClaimedDate,
			bets: []
		})

		jest.spyOn(testSubject, 'getRandomClaimAmount').mockImplementationOnce(() => {
			return 7
		})

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)
		const updatedRecord = await UserModel.findOne({
			guildId: '987',
			userId: '1'
		})

		if (updatedRecord) {
			expect(updatedRecord.balance).toBe(357)
		} else {
			fail('Could not find updated record in database.')
		}
	})

	it('Should not allow a claim when the user is on cooldown', async () => {
		const testSubject = new Claim()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction

		testSubject.setInteraction(mockInteraction)
		const mockDiscordUser: User = ({
			id: '2',
			username: 'SkyJudge',
			displayAvatarURL: jest.fn()
		} as unknown) as User
		const lastClaimedDate = new Date()
		lastClaimedDate.setHours(lastClaimedDate.getHours() - 1)
	
		await UserModel.create({
			guildId: '987',
			userId: '2',
			userName: 'SkyJudge',
			balance: 350,
			lastClaimedAt: lastClaimedDate,
			bets: []
		})

		jest.spyOn(testSubject, 'getRandomClaimAmount').mockImplementationOnce(() => {
			return 7
		})

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)
		const updatedRecord = await UserModel.findOne({
			guildId: '987',
			userId: '2'
		})

		if (updatedRecord) {
			expect(updatedRecord.balance).toBe(350)
		} else {
			fail('Could not find updated record in database.')
		}
	})

	it('getNextClaimTime test', () => {
		const testSubject = new Claim()
        
		jest.spyOn(testSubject, 'getHoursUntilClaim').mockImplementationOnce(() => {
			return 1
		})
		jest.spyOn(testSubject, 'getMinutesUntilClaim').mockImplementationOnce(() => {
			return 15
		})

		expect(testSubject.getNextClaimTime()).toBe('1h 15m')
	})

	it('getDiscordUser test', () => {
		const testSubject = new Claim()
		const mockDiscordUser: User = ({
			id: '2',
			username: 'SkyJudge',
			displayAvatarURL: jest.fn()
		} as unknown) as User

		testSubject.setDiscordUser(mockDiscordUser)

		expect(testSubject.getDiscordUser()).toMatchObject(mockDiscordUser)
	})

	it('should return immediately if not in a guild', async () => {
		const testSubject = new Claim()
		const mockInteraction: ChatInputCommandInteraction = ({
			inGuild: jest.fn(() => false),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction

		await testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).not.toHaveBeenCalled()
	})
})
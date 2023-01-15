/* eslint-disable @typescript-eslint/no-var-requires */
import Claim from '../commands/claim'
import UserModel, { UserDocument } from '../database/models/user'
import dotenv from 'dotenv'
import { User, ChatInputCommandInteraction } from 'discord.js'

dotenv.config()

describe('Claim Command', () => {
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
			options: {
				getString: jest.fn().mockReturnValue('cardinals')
			}
		} as unknown) as ChatInputCommandInteraction

		testSubject.setInteraction(mockInteraction)
		const mockDiscordUser: User = ({
			id: '1234',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User
		const userRecord = {
			guildId: '1234',
			userId: '4321',
			userName: 'Mango',
			balance: 350,
			lastClaimedAt: Date.now(),
			bets: []
		}

		jest.spyOn(testSubject, 'getRandomClaimAmount').mockImplementationOnce(() => {
			return 7
		})

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.processClaim()

		expect(testSubject.getUserRecord().balance).toBe(357)
	})

	// it('Should not allow a claim when the user is on cooldown', () => {
	// 	expect(0).toBe(1)
	// })

	// it('getNextClaimTime test', () => {
	// 	const testSubject = new Claim()
        
	// 	jest.spyOn(testSubject, 'getHoursUntilClaim').mockImplementationOnce(() => {
	// 		return 1
	// 	})
	// 	jest.spyOn(testSubject, 'getMinutesUntilClaim').mockImplementationOnce(() => {
	// 		return 15
	// 	})

	// 	expect(testSubject.getNextClaimTime()).toBe('1h 15m')
	// })
})
import Claim from '../commands/claim'
import UserModel, { UserDocument } from '../database/models/user'
import dotenv from 'dotenv'

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

	it('Should update user record with the claimAmount', () => {
		expect(0).toBe(1)
	})

	it('Should not allow a claim when the user is on cooldown', () => {
		expect(0).toBe(1)
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
})
import Ping from '../commands/ping'
import { CommandInteraction } from 'discord.js'

describe('Ping Command', () => {
	const mockInteraction: CommandInteraction = ({
		reply: jest.fn()
	} as unknown) as CommandInteraction

	it('name should be ping', () => {
		const testSubject = new Ping()
		expect(testSubject.getName()).toBe('ping')
	})
	it('response should be Pong!', () => {
		const testSubject = new Ping()
		testSubject.execute(mockInteraction)
		expect(mockInteraction.reply).toHaveBeenCalledWith('Pong!')
	})
})
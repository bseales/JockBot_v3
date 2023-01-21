import Ping from '../commands/ping'
import { ChatInputCommandInteraction } from 'discord.js'

describe('Ping Command', () => {
	const mockInteraction: ChatInputCommandInteraction = ({
		reply: jest.fn()
	} as unknown) as ChatInputCommandInteraction
	
	it('response should be Pong!', () => {
		const testSubject = new Ping()
		testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).toHaveBeenCalledWith('Pong!')
	})
})
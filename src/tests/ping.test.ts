import Ping from '../commands/ping'

describe('Ping Command', () => {
	it('name should be ping', () => {
		const testSubject = new Ping()
		expect(testSubject.getName()).toBe('ping')
	})
	it('response should be Pong!', () => {
		const testSubject = new Ping()
		expect(testSubject.getResponse()).toBe('Pong!')
	})
})
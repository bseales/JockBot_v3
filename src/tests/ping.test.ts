import Ping from '../commands/ping'

it('should respond with Pong!', () => {
	const testSubject = new Ping()

	expect(testSubject.getResponse()).toBe('Pong!')
})
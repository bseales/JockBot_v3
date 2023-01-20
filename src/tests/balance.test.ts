import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, HexColorString, User } from 'discord.js'
import Balance from '../commands/balance'
import { connectDatabaseTesting, disconnectDBForTesting, dropDB } from '../database/connect'
import UserModel from '../database/models/user'

describe('Balance Command', () => {
	beforeAll(async () => {
		await connectDatabaseTesting()
	})

	afterAll(async () => {
		await disconnectDBForTesting()
	})

	beforeEach(async () => {
		jest.resetAllMocks()
	})

	afterEach(async () => {
		await dropDB()
	})
    
	it('should immediately return if not in a guild', () => {
		const testSubject = new Balance()
		const mockInteraction: ChatInputCommandInteraction = ({
			inGuild: jest.fn(() => false),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction

		testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).not.toHaveBeenCalled()
	})

	it('should instruct the user to run /claim if they haven\'t yet', async () => {
		const testSubject = new Balance()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction
		const mockDiscordUser: User = ({
			id: '1',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementationOnce(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).toHaveBeenCalledWith('Oops! You need to run `/claim` to set up your account!')
	})
	
	it('should return the correct embed for a valid User with an active bet', async () => {
		const testSubject = new Balance()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction
		const mockDiscordUser: User = ({
			id: '1',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User

		// Balance of 300 bux with 50 bux tied up in active bets.
		await UserModel.create({
			guildId: '987',
			userId: '1',
			userName: 'Mango',
			balance: 300,
			lastClaimedAt: new Date(),
			bets: [
				{
					eventWeek: 1,
					team: 'Atlanta Falcons',
					opponentTeam: 'New England Patriots',
					teamId: 2,
					opponentTeamId: 1,
					eventId: '123456',
					amount: 50,
					multiplier: 4.2,
					isPaidOut: false
				}
			]
		})
		const thumbnail: APIEmbedImage = {
			url: mockDiscordUser.displayAvatarURL()
		}
		let description = 'Current Balance: **300 bux**\n\n'
		description += 'Active Bets: **50 bux**'
		const embedColor: HexColorString = '#0099ff'
		const expectedEmbed = new EmbedBuilder({
			title: 'Balance for Mango',
			thumbnail,
			description
		}).setColor(embedColor)

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [expectedEmbed]
		})
	})

	it('should return the correct embed for a valid User with an active and inactive bet', async () => {
		const testSubject = new Balance()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction
		const mockDiscordUser: User = ({
			id: '1',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User

		// Balance of 300 bux, 50 bux tied up in active bets, 50 bux in inactive bet.
		await UserModel.create({
			guildId: '987',
			userId: '1',
			userName: 'Mango',
			balance: 300,
			lastClaimedAt: new Date(),
			bets: [
				{
					eventWeek: 2,
					team: 'Atlanta Falcons',
					opponentTeam: 'New England Patriots',
					teamId: 2,
					opponentTeamId: 1,
					eventId: '123456',
					amount: 50,
					multiplier: 4.2,
					isPaidOut: false
				},
				{
					eventWeek: 1,
					team: 'Chicago Bears',
					opponentTeam: 'New England Patriots',
					teamId: 2,
					opponentTeamId: 1,
					eventId: '123456',
					amount: 50,
					multiplier: 4.2,
					isPaidOut: true,
					didWin: true
				}
			]
		})
		const thumbnail: APIEmbedImage = {
			url: mockDiscordUser.displayAvatarURL()
		}
		let description = 'Current Balance: **300 bux**\n\n'
		description += 'Active Bets: **50 bux**'
		const embedColor: HexColorString = '#0099ff'
		const expectedEmbed = new EmbedBuilder({
			title: 'Balance for Mango',
			thumbnail,
			description
		}).setColor(embedColor)

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [expectedEmbed]
		})
	})
	
	it('should return the correct embed for a valid User with no active bets', async () => {
		const testSubject = new Balance()
		const mockInteraction: ChatInputCommandInteraction = ({
			guildId: '987',
			inGuild: jest.fn(() => true),
			reply: jest.fn()
		} as unknown) as ChatInputCommandInteraction
		const mockDiscordUser: User = ({
			id: '1',
			username: 'Mango',
			displayAvatarURL: jest.fn()
		} as unknown) as User
		await UserModel.create({
			guildId: '987',
			userId: '1',
			userName: 'Mango',
			balance: 350,
			lastClaimedAt: new Date(),
			bets: []
		})
		const thumbnail: APIEmbedImage = {
			url: mockDiscordUser.displayAvatarURL()
		}
		let description = 'Current Balance: **350 bux**\n\n'
		description += 'Active Bets: **0 bux**'
		const embedColor: HexColorString = '#0099ff'
		const expectedEmbed = new EmbedBuilder({
			title: 'Balance for Mango',
			thumbnail,
			description
		}).setColor(embedColor)

		jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
			return mockDiscordUser
		})

		await testSubject.execute(mockInteraction)

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			embeds: [expectedEmbed]
		})
		
	})
})
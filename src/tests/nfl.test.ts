import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, HexColorString, User } from 'discord.js'
import NFLScores from '../commands/nfl/scores'
import NFLLogo from '../commands/nfl/logo'
import SetNFLOdds from '../commands/nfl/setOdds'
import NFLBet from '../commands/nfl/bet'
import axios from 'axios'
import { ESPNBuccsAtFalconsInfo, ESPNPatsAtBills, ESPNScoreboardJson, ESPNTeamJson, ESPNTeamJsonNoLogos, getParsedCommand, mockInteractionAndSpyReply } from './util'
import { connectDatabaseTesting, disconnectDBForTesting, dropDB } from '../database/connect'
import OddsModel from '../database/models/odds'
import UserModel from '../database/models/user'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('NFL Commands', () => {
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
	
	describe('Scores', () => {
		it('should ping the ESPN API', () => {
			const testSubject = new NFLScores()
			const mockedEspnJson = ESPNScoreboardJson()

			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			testSubject.getScoreboard()

			expect(mockedAxios.get).toHaveBeenCalledWith('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
		})

		it('should reply with the correct embed', async () => {
			const testSubject = new NFLScores()
			const commandData = testSubject.commandBuilder
			const command = getParsedCommand('/nfl-scores', commandData)
			const { interaction, spy: interactionReplySpy } = mockInteractionAndSpyReply(command)
			const expectedEmbed = new EmbedBuilder({
				title: 'Scores for NFL Week 18',
				fields: [
					{
						inline: true,
						name: 'TB @ ATL\n11:53 - 2nd',
						value: 'Buccaneers: 17\nFalcons: 10\n[ESPN Gamecast](https://www.espn.com/nfl/game?gameId=401437948)'
					},
					{
						inline: true,
						name: 'NE @ BUF\n1:54 - 2nd',
						value: 'Patriots: 14\nBills: 14\n[ESPN Gamecast](https://www.espn.com/nfl/game?gameId=401437949)'
					}
				],
				'thumbnail': {
					'url': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png?w=100&h=100&transparent=true',
				},
			})

			jest.spyOn(testSubject, 'getScoreboard').mockImplementationOnce(() => {
				return Promise.resolve(ESPNScoreboardJson())
			})

			await testSubject.execute(interaction)

			expect(interactionReplySpy).toHaveBeenCalledWith({
				embeds: [expectedEmbed]
			})
		})
	})

	describe('Logo', () => {
		it('should ping the ESPN API', () => {
			const testSubject = new NFLLogo()
			const mockedEspnJson = ESPNTeamJson()
			const ARIZONA_CARDINALS_ESPN_ID = 22

			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			testSubject.getTeam(ARIZONA_CARDINALS_ESPN_ID)

			expect(mockedAxios.get).toHaveBeenCalledWith(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${ARIZONA_CARDINALS_ESPN_ID}`)
		})

		it('getTeamOption should return the team', () => {
			const testSubject = new NFLLogo()
			const mockInteraction: ChatInputCommandInteraction = ({
				options: {
					getString: jest.fn().mockReturnValue('cardinals')
				}
			} as unknown) as ChatInputCommandInteraction

			testSubject.setInteraction(mockInteraction)
			expect(testSubject.getTeamOption()).toBe('cardinals')
		})

		it('invalid team name should exit early', () => {
			const testSubject = new NFLLogo()
			const mockInteraction: ChatInputCommandInteraction = ({
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('some invalid team name')
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'Invalid team name!',
				ephemeral: true
			})
		})

		it('should reply with the correct embed', async () => {
			const testSubject = new NFLLogo()
			const commandData = testSubject.commandBuilder
			const command = getParsedCommand('/nfl-logo', commandData)
			const { interaction, spy: interactionReplySpy } = mockInteractionAndSpyReply(command)

			const teamImage: APIEmbedImage = {
				url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png'
			}
			const expectedEmbed = new EmbedBuilder({
				title: 'Arizona Cardinals',
				image: teamImage
			})

			jest.spyOn(testSubject, 'getTeam').mockImplementationOnce(() => {
				return Promise.resolve(ESPNTeamJson())
			})

			jest.spyOn(testSubject, 'getTeamOption').mockImplementationOnce(() => {
				return 'cardinals'
			})

			await testSubject.execute(interaction)

			expect(interactionReplySpy).toHaveBeenCalledWith({
				embeds: [expectedEmbed]
			})
		})

		it('should still reply if JSON has no logos', async () => {
			const testSubject = new NFLLogo()
			const commandData = testSubject.commandBuilder
			const command = getParsedCommand('/nfl-logo', commandData)
			const { interaction, spy: interactionReplySpy } = mockInteractionAndSpyReply(command)

			const teamImage: APIEmbedImage = {
				url: ''
			}
			const expectedEmbed = new EmbedBuilder({
				title: 'Arizona Cardinals',
				image: teamImage
			})

			jest.spyOn(testSubject, 'getTeam').mockImplementationOnce(() => {
				return Promise.resolve(ESPNTeamJsonNoLogos())
			})

			jest.spyOn(testSubject, 'getTeamOption').mockImplementationOnce(() => {
				return 'cardinals'
			})

			await testSubject.execute(interaction)

			expect(interactionReplySpy).toHaveBeenCalledWith({
				embeds: [expectedEmbed]
			})
		})
	})

	describe('Set Odds', () => {
		it('should ping the ESPN API', async () => {
			const testSubject = new SetNFLOdds()
			const mockedEspnJson = ESPNScoreboardJson()

			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			testSubject.getScoreboard()

			expect(mockedAxios.get).toHaveBeenCalledWith('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
		})

		it('should set Odds', async () => {
			const testSubject = new SetNFLOdds()

			jest.spyOn(testSubject, 'getGameInfo').mockImplementationOnce(() => {
				return Promise.resolve(ESPNBuccsAtFalconsInfo())
			}).mockImplementationOnce(() => {
				return Promise.resolve(ESPNPatsAtBills())
			})

			jest.spyOn(testSubject, 'getScoreboard').mockImplementation(() => {
				return Promise.resolve(ESPNScoreboardJson())
			})

			expect(await testSubject.oddsAlreadySetThisWeek()).toBe(false)

			await testSubject.setOdds()

			const game1record = await OddsModel.findOne({
				eventId: '401437948'
			})
			const game2record = await OddsModel.findOne({
				eventId: '401437949'
			})
					
			if (!game1record) {
				throw new Error('game1record not found in Odds collection.')
			}
			expect(game1record.homeName).toBe('Atlanta Falcons')
			expect(game1record.homeTeamId).toBe(1)
			expect(game1record.homeTeamMultiplier).toBe(1.42)

			expect(game1record.awayName).toBe('Tampa Bay Buccaneers')
			expect(game1record.awayTeamId).toBe(27)
			expect(game1record.awayTeamMultiplier).toBe(2.96)
		
			if (!game2record) {
				throw new Error('game2record not found in Odds collection.')
			}
			expect(game2record.homeName).toBe('Buffalo Bills')
			expect(game2record.homeTeamId).toBe(2)
			expect(game2record.homeTeamMultiplier).toBe(1.24)

			expect(game2record.awayName).toBe('New England Patriots')
			expect(game2record.awayTeamId).toBe(17)
			expect(game2record.awayTeamMultiplier).toBe(4.2)

			expect(await testSubject.oddsAlreadySetThisWeek()).toBe(true)
		})

		it('should send the correct response when setting odds', async () => {
			const testSubject = new SetNFLOdds()
			const mockInteraction: ChatInputCommandInteraction = ({
				reply: jest.fn(),
				followUp: jest.fn()
			} as unknown) as ChatInputCommandInteraction

			jest.spyOn(testSubject, 'getGameInfo').mockImplementationOnce(() => {
				return Promise.resolve(ESPNBuccsAtFalconsInfo())
			}).mockImplementationOnce(() => {
				return Promise.resolve(ESPNPatsAtBills())
			})

			jest.spyOn(testSubject, 'getScoreboard').mockImplementation(() => {
				return Promise.resolve(ESPNScoreboardJson())
			})

			await testSubject.execute(mockInteraction)
			expect(mockInteraction.reply).toHaveBeenCalledWith('Setting odds...')
			expect(mockInteraction.followUp).toHaveBeenCalledWith('Odds set!')
		})

		it('should send the correct response when odds are already set', async () => {
			const testSubject = new SetNFLOdds()
			const mockInteraction: ChatInputCommandInteraction = ({
				reply: jest.fn(),
				followUp: jest.fn()
			} as unknown) as ChatInputCommandInteraction

			await OddsModel.create({
				eventId: 'some event id',
				awayName: 'away team name',
				awayTeamId: '5',
				awayTeamMultiplier: 1.2,
				eventWeek: 18,
				eventWeekType: 2,
				gameTime: new Date(),
				homeName: 'home team name',
				homeTeamId: '7', 
				homeTeamMultiplier: 4.5,
			})

			jest.spyOn(testSubject, 'getGameInfo').mockImplementationOnce(() => {
				return Promise.resolve(ESPNBuccsAtFalconsInfo())
			}).mockImplementationOnce(() => {
				return Promise.resolve(ESPNPatsAtBills())
			})

			jest.spyOn(testSubject, 'getScoreboard').mockImplementation(() => {
				return Promise.resolve(ESPNScoreboardJson())
			})

			await testSubject.execute(mockInteraction)
			expect(mockInteraction.reply).not.toHaveBeenCalledWith('Setting odds...')
			expect(mockInteraction.followUp).not.toHaveBeenCalled()
			expect(mockInteraction.reply).toHaveBeenCalledWith('Odds already set this week.')
		})
	})

	describe('Bet', () => {
		it('should return immediately if not in a guild', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => false),
				reply: jest.fn()
			} as unknown) as ChatInputCommandInteraction
	
			await testSubject.execute(mockInteraction)
	
			expect(mockInteraction.reply).not.toHaveBeenCalled()
		})

		it('getTeamOption should return the team', () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => false),
				options: {
					getString: jest.fn().mockReturnValue('patriots')
				}
			} as unknown) as ChatInputCommandInteraction

			testSubject.setInteraction(mockInteraction)
			expect(testSubject.getTeamOption()).toBe('patriots')
		})

		it('invalid team name should exit early', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('some invalid team name'),
					getNumber: jest.fn()
				}
			} as unknown) as ChatInputCommandInteraction

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'Invalid team name!',
				ephemeral: true
			})
		})

		it('should not allow negative bets', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('patriots'),
					getNumber: jest.fn().mockReturnValue(-17)
				}
			} as unknown) as ChatInputCommandInteraction

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'Amount must be greater than zero!',
				ephemeral: true
			})
		})

		it('should not allow betting more than available balance', async () => {
			const testSubject = new NFLBet()

			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('patriots'),
					getNumber: jest.fn().mockReturnValue(400)
				}
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
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})
	
			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'You can\'t bet more than your balance!',
				ephemeral: true
			})
		})

		it('verify null espnId', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn()
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)

			expect(await testSubject.verifyInputs(9, null, null)).toBe(false)
		})

		it('verify negative betAmount', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn()
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)

			expect(await testSubject.verifyInputs(-9, 2, null)).toBe(false)
		})

		it('verify null userRecord', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn()
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)

			expect(await testSubject.verifyInputs(9, 2, null)).toBe(false)
		})

		it('verify betAmount > balance', async () => {
			const testSubject = new NFLBet()

			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)

			const userDocument = await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})
			
			expect(await testSubject.verifyInputs(999, 2, userDocument)).toBe(false)
		})

		it('verify all valid inputs', async () => {
			const testSubject = new NFLBet()

			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)

			const userDocument = await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})
			
			expect(await testSubject.verifyInputs(99, 2, userDocument)).toBe(true)
		})

		it('should notify the user and not allow bets if Odds not set for this week', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('patriots'),
					getNumber: jest.fn().mockReturnValue(17)
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)
			await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})

			const mockedEspnJson = ESPNScoreboardJson()
			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'NFL Odds haven\'t been set yet for this week. Please let Iron Man know!',
				ephemeral: true
			})
		})

		it('should notify the user and not allow bets if no Odds for that team this week', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('patriots'),
					getNumber: jest.fn().mockReturnValue(17)
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)
			await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})

			// We have odds for a Falcons and Bills game, but not Patriots.
			await OddsModel.create({
				eventId: '654654',
				awayName: '',
				awayTeamId: 1,
				awayTeamMultiplier: 1.2,
				eventWeek: 18,
				eventWeekType: 2,
				gameTime: new Date(),
				homeName: '',
				homeTeamId: 2, 
				homeTeamMultiplier: 3.2,
			})

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})

			const mockedEspnJson = ESPNScoreboardJson()
			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'I don\'t have any Odds for that team this week.',
				ephemeral: true
			})
		})

		it('should not allow betting on a game that has already started', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				options: {
					getString: jest.fn().mockReturnValue('falcons'),
					getNumber: jest.fn().mockReturnValue(17)
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)
			await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})

			await OddsModel.create({
				eventId: '654654',
				awayName: '',
				awayTeamId: 1,
				awayTeamMultiplier: 1.2,
				eventWeek: 18,
				eventWeekType: 2,
				gameTime: new Date(Date.now() - 5000),
				homeName: '',
				homeTeamId: 2, 
				homeTeamMultiplier: 3.2,
			})

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})

			const mockedEspnJson = ESPNScoreboardJson()
			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			
			await testSubject.execute(mockInteraction)

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'That game\'s official start time has already passed.',
				ephemeral: true
			})
		})

		it('should work when betting on the home team', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				user: {
					username: 'Mango'
				},
				options: {
					getString: jest.fn().mockReturnValue('bills'),
					getNumber: jest.fn().mockReturnValue(20)
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)
			await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})

			await OddsModel.create({
				eventId: '654654',
				awayName: 'Atlanta Falcons',
				awayTeamId: 1,
				awayTeamMultiplier: 1.2,
				eventWeek: 18,
				eventWeekType: 2,
				gameTime: new Date(Date.now() + 50000),
				homeName: 'Buffalo Bills',
				homeTeamId: 2, 
				homeTeamMultiplier: 3.2,
			})

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			let description = 'Team: **Buffalo Bills**\n\n'
			description += 'Wager: **20 bux**\n'
			description += 'Multiplier: **3.2**\n'
			description += 'Potential Return: **64 bux (+44)**\n\n'
			description += 'Current Balance: **280 bux**'

			const thumbnail: APIEmbedImage = {
				url: mockDiscordUser.displayAvatarURL()
			}
			const embedColor: HexColorString = '#0099ff'
			const expectedEmbed = new EmbedBuilder({
				title: `Bet Receipt for ${mockDiscordUser.username}`,
				thumbnail,
				description
			}).setColor(embedColor)

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})

			const mockedEspnJson = ESPNScoreboardJson()
			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			
			await testSubject.execute(mockInteraction)

			const userRecord = await UserModel.findOne({
				guildId: '987',
				userId: '1'
			})
	
			if (userRecord) {
				expect(userRecord.balance).toBe(280)
				expect(userRecord.bets).toStrictEqual([
					{
						sport: 'NFL',
						eventWeek: 18,
						eventWeekType: 2,
						team: 'Buffalo Bills',
						opponentTeam: 'Atlanta Falcons',
						teamId: 2,
						opponentTeamId: 1,
						eventId: '654654',
						amount: 20,
						multiplier: 3.2,
						isPaidOut: false,
					}
				])
				
				expect(mockInteraction.reply).toHaveBeenCalledWith({
					embeds: [expectedEmbed]
				})
			} else {
				fail('Could not find updated record in database.')
			}
		})

		it('should work when betting on the away team', async () => {
			const testSubject = new NFLBet()
			const mockInteraction: ChatInputCommandInteraction = ({
				inGuild: jest.fn(() => true),
				guildId: '987',
				reply: jest.fn(),
				user: {
					username: 'Mango'
				},
				options: {
					getString: jest.fn().mockReturnValue('falcons'),
					getNumber: jest.fn().mockReturnValue(20)
				}
			} as unknown) as ChatInputCommandInteraction
			testSubject.setInteraction(mockInteraction)
			await UserModel.create({
				guildId: '987',
				userId: '1',
				userName: 'Mango',
				balance: 300,
				lastClaimedAt: new Date(),
				bets: []
			})

			await OddsModel.create({
				eventId: '654654',
				awayName: 'Atlanta Falcons',
				awayTeamId: 1,
				awayTeamMultiplier: 1.2,
				eventWeek: 18,
				eventWeekType: 2,
				gameTime: new Date(Date.now() + 50000),
				homeName: 'Buffalo Bills',
				homeTeamId: 2, 
				homeTeamMultiplier: 3.2,
			})

			const mockDiscordUser: User = ({
				id: '1',
				username: 'Mango',
				displayAvatarURL: jest.fn()
			} as unknown) as User

			let description = 'Team: **Atlanta Falcons**\n\n'
			description += 'Wager: **20 bux**\n'
			description += 'Multiplier: **1.2**\n'
			description += 'Potential Return: **24 bux (+4)**\n\n'
			description += 'Current Balance: **280 bux**'

			const thumbnail: APIEmbedImage = {
				url: mockDiscordUser.displayAvatarURL()
			}
			const embedColor: HexColorString = '#0099ff'
			const expectedEmbed = new EmbedBuilder({
				title: `Bet Receipt for ${mockDiscordUser.username}`,
				thumbnail,
				description
			}).setColor(embedColor)

			jest.spyOn(testSubject, 'getDiscordUser').mockImplementation(() => {
				return mockDiscordUser
			})

			const mockedEspnJson = ESPNScoreboardJson()
			mockedAxios.get.mockResolvedValue({data: mockedEspnJson})
			
			await testSubject.execute(mockInteraction)

			const userRecord = await UserModel.findOne({
				guildId: '987',
				userId: '1'
			})
	
			if (userRecord) {
				expect(userRecord.balance).toBe(280)
				expect(userRecord.bets).toStrictEqual([
					{
						sport: 'NFL',
						eventWeek: 18,
						eventWeekType: 2,
						team: 'Atlanta Falcons',
						opponentTeam: 'Buffalo Bills',
						teamId: 1,
						opponentTeamId: 2,
						eventId: '654654',
						amount: 20,
						multiplier: 1.2,
						isPaidOut: false,
					}
				])
				
				expect(mockInteraction.reply).toHaveBeenCalledWith({
					embeds: [expectedEmbed]
				})
			} else {
				fail('Could not find updated record in database.')
			}
		})
	})
})


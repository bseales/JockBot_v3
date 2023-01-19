import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import NFLScores from '../commands/nfl/scores'
import NFLLogo from '../commands/nfl/logo'
import SetNFLOdds from '../commands/nfl/setOdds'
import axios from 'axios'
import { ESPNBuccsAtFalconsInfo, ESPNPatsAtBills, ESPNScoreboardJson, ESPNTeamJson, ESPNTeamJsonNoLogos, getParsedCommand, mockInteractionAndSpyReply } from './util'
import { connectDatabaseTesting, disconnectDBForTesting, dropDB } from '../database/connect'
import OddsModel from '../database/models/odds'
import { doesNotMatch } from 'assert'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('NFL Commands', () => {
	beforeAll(async () => {
		await connectDatabaseTesting()
	})

	afterAll(async () => {
		await disconnectDBForTesting()
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
						name: 'TB @ ATL | 11:53 - 2nd',
						value: 'Buccaneers: 17\nFalcons: 10\n[ESPN Gamecast](https://www.espn.com/nfl/game?gameId=401437948)'
					},
					{
						inline: true,
						name: 'NE @ BUF | 1:54 - 2nd',
						value: 'Patriots: 14\nBills: 14\n[ESPN Gamecast](https://www.espn.com/nfl/game?gameId=401437949)'
					}
				]
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

			testSubject.scoreboard = ESPNScoreboardJson()
			testSubject.eventWeek = ESPNScoreboardJson().week.number
			testSubject.eventWeekType = ESPNScoreboardJson().season.type

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

		// it('should send the correct embed', () => {

		// })
	})
})


import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import NFLScores from '../commands/nfl/scores'
import NFLLogo from '../commands/nfl/logo'
import axios from 'axios'
import { ESPNScoreboardJson, ESPNTeamJson, getParsedCommand, mockInteraction, mockInteractionAndSpyReply } from './util'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('NFL Commands', () => {
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
				title: 'Scores for NFL Week 1',
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

			jest.spyOn(testSubject, 'getScoreboard').mockImplementation(() => {
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

			jest.spyOn(testSubject, 'getTeam').mockImplementation(() => {
				return Promise.resolve(ESPNTeamJson())
			})

			jest.spyOn(testSubject, 'getTeamOption').mockImplementation(() => {
				return 'cardinals'
			})

			await testSubject.execute(interaction)

			expect(interactionReplySpy).toHaveBeenCalledWith({
				embeds: [expectedEmbed]
			})
		})
	})
})


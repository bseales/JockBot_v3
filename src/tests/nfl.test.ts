import { CommandInteraction, EmbedBuilder } from 'discord.js'
import NFLScores from '../commands/nfl/scores'
import axios from 'axios'
import { ESPNScoreboardJson, getParsedCommand, mockInteractionAndSpyReply } from './util'

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

		it('replies with the correct embed', async () => {
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
})


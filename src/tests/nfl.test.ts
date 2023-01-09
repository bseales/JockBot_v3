import { CommandInteraction, EmbedBuilder } from 'discord.js'
import NFLScores from '../commands/nfl/scores'
import axios from 'axios'
import { getParsedCommand, mockInteractionAndSpyReply } from './util'
import { NFLScoreboard } from '../interfaces/espn/nfl'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('NFL Commands', () => {
	const mockInteraction: CommandInteraction = ({
		reply: jest.fn()
	} as unknown) as CommandInteraction
    
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

			jest.spyOn(testSubject, 'getScoreboard').mockImplementation(() => {
				return Promise.resolve(ESPNScoreboardJson())
			})

			await testSubject.execute(interaction)

			const expectedEmbed = new EmbedBuilder({
				title: 'Scores for NFL Week 1',
				fields: [{
					inline: true,
					name: 'TB @ ATL | 11:53 - 2nd',
					value: 'Buccaneers: 17\nFalcons: 10\n[ESPN Gamecast](https://www.espn.com/nfl/game?gameId=401437948)'
				}]
			})

			expect(interactionReplySpy).toHaveBeenCalledWith({
				embeds: [expectedEmbed]
			})
		})
	})
})

function ESPNScoreboardJson(): NFLScoreboard {
	return { 
		events: [
			{
				id: '401437948',
				uid: 's:20~l:28~e:401437948',
				date: '2023-01-08T18:00Z',
				name: 'Tampa Bay Buccaneers at Atlanta Falcons',
				shortName: 'TB @ ATL',
				season: {
					year: 2022,
					type: 2,
					slug: 'regular-season'
				},
				week: {
					'number': 18
				},
				competitions: [{
					venue: {
						id: '5348',
						fullName: 'Mercedes-Benz Stadium',
						address: {
							city: 'Atlanta',
							state: 'GA'
						},
						capacity: 75000,
						indoor: true
					},
					competitors: [
						{
							id: '1',
							uid: 's:20~l:28~t:1',
							type: 'team',
							order: 0,
							homeAway: 'home',
							score: '10',
							team: {
								id: '1',
								uid: 's:20~l:28~t:1',
								location: 'Atlanta',
								name: 'Falcons',
								abbreviation: 'ATL',
								displayName: 'Atlanta Falcons',
								shortDisplayName: 'Falcons',
								color: '000000',
								alternateColor: '000000',
								isActive: true,
								venue: {
									id: '5348'
								},
								links: [
									{
										rel: [
											'clubhouse',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/_/name/atl/atlanta-falcons',
										text: 'Clubhouse',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'roster',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/team/roster/_/name/atl/atlanta-falcons',
										text: 'Roster',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'stats',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/team/stats/_/name/atl/atlanta-falcons',
										text: 'Statistics',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'schedule',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/schedule/_/name/atl',
										text: 'Schedule',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'photos',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/photos/_/name/atl',
										text: 'photos',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'scores',
											'sportscenter',
											'app',
											'team'
										],
										href: 'sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:1&section=scores',
										text: 'Scores',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'draftpicks',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/draft/teams/_/name/atl/atlanta-falcons',
										text: 'Draft Picks',
										isExternal: false,
										isPremium: true
									},
									{
										rel: [
											'transactions',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/transactions/_/name/atl',
										text: 'Transactions',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'injuries',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/injuries/_/name/atl',
										text: 'Injuries',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'depthchart',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/depth/_/name/atl',
										text: 'Depth Chart',
										isExternal: false,
										isPremium: false
									}
								],
								logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png'
							}
						},
						{
							id: '27',
							uid: 's:20~l:28~t:27',
							type: 'team',
							order: 1,
							homeAway: 'away',
							score: '17',
							team: {
								id: '27',
								uid: 's:20~l:28~t:27',
								location: 'Tampa Bay',
								name: 'Buccaneers',
								abbreviation: 'TB',
								displayName: 'Tampa Bay Buccaneers',
								shortDisplayName: 'Buccaneers',
								color: 'A80D08',
								alternateColor: '34302b',
								isActive: true,
								venue: {
									id: '3886'
								},
								links: [
									{
										rel: [
											'clubhouse',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/_/name/tb/tampa-bay-buccaneers',
										text: 'Clubhouse',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'roster',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/team/roster/_/name/tb/tampa-bay-buccaneers',
										text: 'Roster',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'stats',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/team/stats/_/name/tb/tampa-bay-buccaneers',
										text: 'Statistics',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'schedule',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/schedule/_/name/tb',
										text: 'Schedule',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'photos',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/photos/_/name/tb',
										text: 'photos',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'scores',
											'sportscenter',
											'app',
											'team'
										],
										href: 'sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:27&section=scores',
										text: 'Scores',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'draftpicks',
											'desktop',
											'team'
										],
										href: 'http://www.espn.com/nfl/draft/teams/_/name/tb/tampa-bay-buccaneers',
										text: 'Draft Picks',
										isExternal: false,
										isPremium: true
									},
									{
										rel: [
											'transactions',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/transactions/_/name/tb',
										text: 'Transactions',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'injuries',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/injuries/_/name/tb',
										text: 'Injuries',
										isExternal: false,
										isPremium: false
									},
									{
										rel: [
											'depthchart',
											'desktop',
											'team'
										],
										href: 'https://www.espn.com/nfl/team/depth/_/name/tb',
										text: 'Depth Chart',
										isExternal: false,
										isPremium: false
									}
								],
								logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png'
							},
						}
					],
					status: {
						'clock': 106,
						'displayClock': '1:46',
						'period': 2,
						type: {
							shortDetail: '11:53 - 2nd'
						}
					},
					situation: {
						$ref: 'http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/events/401437948/competitions/401437948/situation?lang=en&region=us',
						lastPlay: {
							id: '4014379481697',
							type: {
								id: '53',
								text: 'Kickoff',
								abbreviation: 'K'
							},
							text: 'J.Camarda kicks 65 yards from TB 35 to end zone, Touchback.',
							scoreValue: 0,
							team: {
								id: '1'
							},
							probability: {
								tiePercentage: 0,
								homeWinPercentage: 0.306,
								awayWinPercentage: 0.694,
								secondsLeft: 0
							},
							drive: {
								description: '0 plays, 0 yards, 0:00',
								start: {
									yardLine: 0,
									text: 'ATL 0'
								},
								timeElapsed: {
									displayValue: '0:00'
								}
							},
							start: {
								yardLine: 65,
								team: {
									id: '27'
								}
							},
							end: {
								yardLine: 25,
								team: {
									id: '1'
								}
							},
							statYardage: 0,
							athletesInvolved: [
								{
									id: '4379396',
									fullName: 'Jake Camarda',
									displayName: 'Jake Camarda',
									shortName: 'J. Camarda',
									links: [
										{
											'rel': [
												'playercard',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'stats',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/stats/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'splits',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/splits/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'gamelog',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/gamelog/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'news',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/news/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'bio',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/bio/_/id/4379396/jake-camarda'
										},
										{
											'rel': [
												'overview',
												'desktop',
												'athlete'
											],
											'href': 'http://www.espn.com/nfl/player/_/id/4379396/jake-camarda'
										}
									],
									'headshot': 'https://a.espncdn.com/i/headshots/nfl/players/full/4379396.png',
									'jersey': '5',
									'position': 'P',
									'team': {
										'id': '27'
									}
								}
							]
						},
						'down': 1,
						'yardLine': 25,
						'distance': 10,
						'downDistanceText': '1st & 10 at ATL 25',
						'shortDownDistanceText': '1st & 10',
						'possessionText': 'ATL 25',
						'isRedZone': false,
						'homeTimeouts': 2,
						'awayTimeouts': 1
					},
				}],
				links: [{
					href: 'https://www.espn.com/nfl/game?gameId=401437948'
				}]
			}
		],
		week: {
			number: 1
		}
	} 
}
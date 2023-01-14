// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import MockDiscord from './mockDiscord'

export const defaultConfig = {
	id: '11',
	lang: 'en',
	prefix: '.',
	almanaxChannel: 'almanax',
	partyChannel: 'listagem-de-grupos',
	buildPreview: 'enabled'
}

export const optionType = {
	// 0: null,
	// 1: subCommand,
	// 2: subCommandGroup,
	3: String,
	4: Number,
	5: Boolean,
	// 6: user,
	// 7: channel,
	// 8: role,
	// 9: mentionable,
	10: Number,
}

function getNestedOptions(options) {
	return options.reduce((allOptions, option) => {
		if (!option.options) return [...allOptions, option]
		const nestedOptions = getNestedOptions(option.options)
		return [option, ...allOptions, ...nestedOptions]
	}, [])
}

function castToType(value: string, typeId: number) {
	const typeCaster = optionType[typeId]
	return typeCaster ? typeCaster(value) : value
}

export function mockInteractionAndSpyReply(command) {
	const discord = new MockDiscord({ command })
	const interaction = discord.getInteraction() as ChatInputCommandInteraction
	const spy = jest.spyOn(interaction, 'reply') 
	return { interaction, spy }
}

export function mockInteraction(command) {
	const discord = new MockDiscord({ command })
	const interaction = discord.getInteraction() as ChatInputCommandInteraction

	return interaction
}

export async function executeCommandAndSpyReply(command, content, config = {}) {
	const { interaction, spy } = mockInteractionAndSpyReply(content)
	const commandInstance = new command()//interaction, {...defaultConfig, ...config})
	await commandInstance.execute(interaction)
	return spy
}

export function getParsedCommand(stringCommand: string, commandData) {
	const options = getNestedOptions(commandData.options)
	const optionsIndentifiers = options.map(option => `${option.name}:`)
	const requestedOptions = options.reduce((requestedOptions, option) => {
		const identifier = `${option.name}:`
		if (!stringCommand.includes(identifier)) return requestedOptions
		const remainder = stringCommand.split(identifier)[1]
  
		const nextOptionIdentifier = remainder.split(' ').find(word => optionsIndentifiers.includes(word))
		if (nextOptionIdentifier) {
			const value = remainder.split(nextOptionIdentifier)[0].trim()
			return [...requestedOptions, {
				name: option.name,
				value: castToType(value, option.type),
				type: option.type
			}]
		}
      
		return [...requestedOptions, {
			name: option.name,
			value: castToType(remainder.trim(), option.type),
			type: option.type
		}]
	}, [])
	const optionNames = options.map(option => option.name)
	const splittedCommand = stringCommand.split(' ')
	const name = splittedCommand[0].replace('/', '')
	const subcommand = splittedCommand.find(word => optionNames.includes(word))
	return {
		id: name,
		name,
		type: 1,
		options: subcommand ? [{
			name: subcommand,
			type: 1,
			options: requestedOptions
		}] : requestedOptions
	}
}

export function embedContaining(content) {
	return {
		embeds: expect.arrayContaining([expect.objectContaining(content)])
	}
}

export function ESPNTeamJson(): Team {
	return {'id':'22','uid':'s:20~l:28~t:22','slug':'arizona-cardinals','location':'Arizona','name':'Cardinals','nickname':'Cardinals','abbreviation':'ARI','displayName':'Arizona Cardinals','shortDisplayName':'Cardinals','color':'A40227','alternateColor':'000000','isActive':true,'logos':[{'href':'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png','width':500,'height':500,'alt':'','rel':['full','default'],'lastUpdated':'2018-06-05T12:11Z'},{'href':'https://a.espncdn.com/i/teamlogos/nfl/500-dark/ari.png','width':500,'height':500,'alt':'','rel':['full','dark'],'lastUpdated':'2018-06-05T12:11Z'},{'href':'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png','width':500,'height':500,'alt':'','rel':['full','scoreboard'],'lastUpdated':'2018-06-05T12:11Z'},{'href':'https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/ari.png','width':500,'height':500,'alt':'','rel':['full','scoreboard','dark'],'lastUpdated':'2018-06-05T12:11Z'}],'record':{'items':[{'type':'total','summary':'4-13','stats':[{'name':'OTLosses','value':1.0},{'name':'OTWins','value':1.0},{'name':'avgPointsAgainst','value':26.411764},{'name':'avgPointsFor','value':20.0},{'name':'clincher','value':0.0},{'name':'differential','value':-109.0},{'name':'divisionWinPercent','value':0.16666667},{'name':'gamesBehind','value':0.0},{'name':'gamesPlayed','value':17.0},{'name':'leagueWinPercent','value':0.25},{'name':'losses','value':13.0},{'name':'playoffSeed','value':15.0},{'name':'points','value':-4.5},{'name':'pointsAgainst','value':449.0},{'name':'pointsFor','value':340.0},{'name':'streak','value':-7.0},{'name':'ties','value':0.0},{'name':'winPercent','value':0.23529412},{'name':'wins','value':4.0},{'name':'divisionLosses','value':5.0},{'name':'divisionRecord','value':0.0},{'name':'divisionTies','value':0.0},{'name':'divisionWins','value':1.0}]},{'description':'Home Record','type':'home','summary':'1-8','stats':[{'name':'wins','value':1.0},{'name':'losses','value':8.0},{'name':'ties','value':0.0},{'name':'winPercent','value':0.1111111119389534},{'name':'OTLosses','value':1.0}]},{'description':'Away Record','type':'road','summary':'3-5','stats':[{'name':'wins','value':3.0},{'name':'losses','value':5.0},{'name':'ties','value':0.0},{'name':'winPercent','value':0.375},{'name':'OTLosses','value':0.0}]}]},'groups':{'id':'3','parent':{'id':'7'},'isConference':false},'links':[{'language':'en-US','rel':['clubhouse','desktop','team'],'href':'https://www.espn.com/nfl/team/_/name/ari/arizona-cardinals','text':'Clubhouse','shortText':'Clubhouse','isExternal':false,'isPremium':false},{'language':'en-US','rel':['roster','desktop','team'],'href':'http://www.espn.com/nfl/team/roster/_/name/ari/arizona-cardinals','text':'Roster','shortText':'Roster','isExternal':false,'isPremium':false},{'language':'en-US','rel':['stats','desktop','team'],'href':'http://www.espn.com/nfl/team/stats/_/name/ari/arizona-cardinals','text':'Statistics','shortText':'Statistics','isExternal':false,'isPremium':false},{'language':'en-US','rel':['schedule','desktop','team'],'href':'https://www.espn.com/nfl/team/schedule/_/name/ari','text':'Schedule','shortText':'Schedule','isExternal':false,'isPremium':false},{'language':'en-US','rel':['photos','desktop','team'],'href':'https://www.espn.com/nfl/team/photos/_/name/ari','text':'photos','shortText':'photos','isExternal':false,'isPremium':false},{'language':'en-US','rel':['scores','sportscenter','app','team'],'href':'sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:22&section=scores','text':'Scores','shortText':'Scores','isExternal':false,'isPremium':false},{'language':'en-US','rel':['draftpicks','desktop','team'],'href':'http://www.espn.com/nfl/draft/teams/_/name/ari/arizona-cardinals','text':'Draft Picks','shortText':'Draft Picks','isExternal':false,'isPremium':true},{'language':'en-US','rel':['transactions','desktop','team'],'href':'https://www.espn.com/nfl/team/transactions/_/name/ari','text':'Transactions','shortText':'Transactions','isExternal':false,'isPremium':false},{'language':'en-US','rel':['injuries','desktop','team'],'href':'https://www.espn.com/nfl/team/injuries/_/name/ari','text':'Injuries','shortText':'Injuries','isExternal':false,'isPremium':false},{'language':'en-US','rel':['depthchart','desktop','team'],'href':'https://www.espn.com/nfl/team/depth/_/name/ari','text':'Depth Chart','shortText':'Depth Chart','isExternal':false,'isPremium':false}],'franchise':{'$ref':'http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/franchises/22?lang=en&region=us','id':'22','uid':'s:20~l:28~f:22','slug':'arizona-cardinals','location':'Arizona','name':'Cardinals','nickname':'Cardinals','abbreviation':'ARI','displayName':'Arizona Cardinals','shortDisplayName':'Cardinals','color':'A40227','isActive':true,'venue':{'$ref':'http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/venues/3970?lang=en&region=us','id':'3970','fullName':'State Farm Stadium','address':{'city':'Glendale','state':'AZ','zipCode':'85305'},'capacity':65000,'grass':true,'indoor':true,'images':[{'href':'https://a.espncdn.com/i/venues/nfl/day/3970.jpg','width':2000,'height':1125,'alt':'','rel':['full','day']},{'href':'https://a.espncdn.com/i/venues/nfl/day/interior/3970.jpg','width':2000,'height':1125,'alt':'','rel':['full','day','interior']}]},'team':{'$ref':'http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/seasons/2022/teams/22?lang=en&region=us'}},'nextEvent':[],'standingSummary':'4th in NFC West'}
}

export function ESPNScoreboardJson(): NFLScoreboard {
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
			},
			{
				'id': '401437949',
				'uid': 's:20~l:28~e:401437949',
				'date': '2023-01-08T18:00Z',
				'name': 'New England Patriots at Buffalo Bills',
				'shortName': 'NE @ BUF',
				'season': {
					'year': 2022,
					'type': 2,
					'slug': 'regular-season'
				},
				'week': {
					'number': 18
				},
				'competitions': [
					{
						'id': '401437949',
						'uid': 's:20~l:28~e:401437949~c:401437949',
						'date': '2023-01-08T18:00Z',
						'attendance': 0,
						'type': {
							'id': '1',
							'abbreviation': 'STD'
						},
						'timeValid': true,
						'neutralSite': false,
						'conferenceCompetition': false,
						'recent': true,
						'venue': {
							'id': '3883',
							'fullName': 'Highmark Stadium',
							'address': {
								'city': 'Orchard Park',
								'state': 'NY'
							},
							'capacity': 71621,
							'indoor': false
						},
						'competitors': [
							{
								'id': '2',
								'uid': 's:20~l:28~t:2',
								'type': 'team',
								'order': 0,
								'homeAway': 'home',
								'team': {
									'id': '2',
									'uid': 's:20~l:28~t:2',
									'location': 'Buffalo',
									'name': 'Bills',
									'abbreviation': 'BUF',
									'displayName': 'Buffalo Bills',
									'shortDisplayName': 'Bills',
									'color': '04407F',
									'alternateColor': 'c60c30',
									'isActive': true,
									'venue': {
										'id': '3883'
									},
									'links': [
										{
											'rel': [
												'clubhouse',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/_/name/buf/buffalo-bills',
											'text': 'Clubhouse',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'roster',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/team/roster/_/name/buf/buffalo-bills',
											'text': 'Roster',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'stats',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/team/stats/_/name/buf/buffalo-bills',
											'text': 'Statistics',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'schedule',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/schedule/_/name/buf',
											'text': 'Schedule',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'photos',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/photos/_/name/buf',
											'text': 'photos',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'scores',
												'sportscenter',
												'app',
												'team'
											],
											'href': 'sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:2&section=scores',
											'text': 'Scores',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'draftpicks',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/draft/teams/_/name/buf/buffalo-bills',
											'text': 'Draft Picks',
											'isExternal': false,
											'isPremium': true
										},
										{
											'rel': [
												'transactions',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/transactions/_/name/buf',
											'text': 'Transactions',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'injuries',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/injuries/_/name/buf',
											'text': 'Injuries',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'depthchart',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/depth/_/name/buf',
											'text': 'Depth Chart',
											'isExternal': false,
											'isPremium': false
										}
									],
									'logo': 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png'
								},
								'score': '14',
								'linescores': [
									{
										'value': 7
									},
									{
										'value': 7
									}
								],
								'statistics': [],
								'records': [
									{
										'name': 'overall',
										'abbreviation': 'Any',
										'type': 'total',
										'summary': '12-3'
									},
									{
										'name': 'Home',
										'type': 'home',
										'summary': '6-1'
									},
									{
										'name': 'Road',
										'type': 'road',
										'summary': '6-2'
									}
								]
							},
							{
								'id': '17',
								'uid': 's:20~l:28~t:17',
								'type': 'team',
								'order': 1,
								'homeAway': 'away',
								'team': {
									'id': '17',
									'uid': 's:20~l:28~t:17',
									'location': 'New England',
									'name': 'Patriots',
									'abbreviation': 'NE',
									'displayName': 'New England Patriots',
									'shortDisplayName': 'Patriots',
									'color': '02244A',
									'alternateColor': 'b0b7bc',
									'isActive': true,
									'venue': {
										'id': '3738'
									},
									'links': [
										{
											'rel': [
												'clubhouse',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/_/name/ne/new-england-patriots',
											'text': 'Clubhouse',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'roster',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/team/roster/_/name/ne/new-england-patriots',
											'text': 'Roster',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'stats',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/team/stats/_/name/ne/new-england-patriots',
											'text': 'Statistics',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'schedule',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/schedule/_/name/ne',
											'text': 'Schedule',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'photos',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/photos/_/name/ne',
											'text': 'photos',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'scores',
												'sportscenter',
												'app',
												'team'
											],
											'href': 'sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:17&section=scores',
											'text': 'Scores',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'draftpicks',
												'desktop',
												'team'
											],
											'href': 'http://www.espn.com/nfl/draft/teams/_/name/ne/new-england-patriots',
											'text': 'Draft Picks',
											'isExternal': false,
											'isPremium': true
										},
										{
											'rel': [
												'transactions',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/transactions/_/name/ne',
											'text': 'Transactions',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'injuries',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/injuries/_/name/ne',
											'text': 'Injuries',
											'isExternal': false,
											'isPremium': false
										},
										{
											'rel': [
												'depthchart',
												'desktop',
												'team'
											],
											'href': 'https://www.espn.com/nfl/team/depth/_/name/ne',
											'text': 'Depth Chart',
											'isExternal': false,
											'isPremium': false
										}
									],
									'logo': 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png'
								},
								'score': '14',
								'linescores': [
									{
										'value': 7
									},
									{
										'value': 7
									}
								],
								'statistics': [],
								'records': [
									{
										'name': 'overall',
										'abbreviation': 'Any',
										'type': 'total',
										'summary': '8-8'
									},
									{
										'name': 'Home',
										'type': 'home',
										'summary': '4-4'
									},
									{
										'name': 'Road',
										'type': 'road',
										'summary': '4-4'
									}
								]
							}
						],
						'notes': [],
						'situation': {
							'$ref': 'http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/events/401437949/competitions/401437949/situation?lang=en&region=us',
							'lastPlay': {
								'id': '4014379491732',
								'type': {
									'id': '21',
									'text': 'Timeout',
									'abbreviation': 'TO'
								},
								'text': 'Timeout #1 by NE at 01:17.',
								'scoreValue': 0,
								'team': {
									'id': '2'
								},
								'probability': {
									'tiePercentage': 0,
									'homeWinPercentage': 0.7536,
									'awayWinPercentage': 0.24639999999999995,
									'secondsLeft': 0
								},
								'drive': {
									'description': '5 plays, 42 yards, 2:28',
									'start': {
										'yardLine': 28,
										'text': 'BUF 28'
									},
									'timeElapsed': {
										'displayValue': '2:28'
									}
								},
								'start': {
									'yardLine': 70,
									'team': {
										'id': '2'
									}
								},
								'end': {
									'yardLine': 70,
									'team': {
										'id': '2'
									}
								},
								'statYardage': 0
							},
							'down': 3,
							'yardLine': 70,
							'distance': 1,
							'downDistanceText': '3rd & 1 at NE 30',
							'shortDownDistanceText': '3rd & 1',
							'possessionText': 'NE 30',
							'isRedZone': false,
							'homeTimeouts': 3,
							'awayTimeouts': 2,
							'possession': '2'
						},
						'status': {
							'clock': 114,
							'displayClock': '1:54',
							'period': 2,
							'type': {
								'id': '2',
								'name': 'STATUS_IN_PROGRESS',
								'state': 'in',
								'completed': false,
								'description': 'In Progress',
								'detail': '1:54 - 2nd Quarter',
								'shortDetail': '1:54 - 2nd'
							}
						},
						'broadcasts': [
							{
								'market': 'national',
								'names': [
									'CBS'
								]
							}
						],
						'leaders': [
							{
								'name': 'passingYards',
								'displayName': 'Passing Leader',
								'shortDisplayName': 'PASS',
								'abbreviation': 'PYDS',
								'leaders': [
									{
										'displayValue': '13-15, 119 YDS, 2 TD',
										'value': 119,
										'athlete': {
											'id': '4241464',
											'fullName': 'Mac Jones',
											'displayName': 'Mac Jones',
											'shortName': 'M. Jones',
											'links': [
												{
													'rel': [
														'playercard',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'stats',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/stats/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'splits',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/splits/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'gamelog',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/gamelog/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'news',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/news/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'bio',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/bio/_/id/4241464/mac-jones'
												},
												{
													'rel': [
														'overview',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/4241464/mac-jones'
												}
											],
											'headshot': 'https://a.espncdn.com/i/headshots/nfl/players/full/4241464.png',
											'jersey': '10',
											'position': {
												'abbreviation': 'QB'
											},
											'team': {
												'id': '17'
											},
											'active': true
										},
										'team': {
											'id': '17'
										}
									}
								]
							},
							{
								'name': 'rushingYards',
								'displayName': 'Rushing Leader',
								'shortDisplayName': 'RUSH',
								'abbreviation': 'RYDS',
								'leaders': [
									{
										'displayValue': '5 CAR, 26 YDS',
										'value': 26,
										'athlete': {
											'id': '4379399',
											'fullName': 'James Cook',
											'displayName': 'James Cook',
											'shortName': 'J. Cook',
											'links': [
												{
													'rel': [
														'playercard',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'stats',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/stats/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'splits',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/splits/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'gamelog',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/gamelog/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'news',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/news/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'bio',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/bio/_/id/4379399/james-cook'
												},
												{
													'rel': [
														'overview',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/4379399/james-cook'
												}
											],
											'headshot': 'https://a.espncdn.com/i/headshots/nfl/players/full/4379399.png',
											'jersey': '28',
											'position': {
												'abbreviation': 'RB'
											},
											'team': {
												'id': '2'
											},
											'active': true
										},
										'team': {
											'id': '2'
										}
									}
								]
							},
							{
								'name': 'receivingYards',
								'displayName': 'Receiving Leader',
								'shortDisplayName': 'REC',
								'abbreviation': 'RECYDS',
								'leaders': [
									{
										'displayValue': '5 REC, 49 YDS',
										'value': 49,
										'athlete': {
											'id': '2976212',
											'fullName': 'Stefon Diggs',
											'displayName': 'Stefon Diggs',
											'shortName': 'S. Diggs',
											'links': [
												{
													'rel': [
														'playercard',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'stats',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/stats/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'splits',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/splits/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'gamelog',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/gamelog/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'news',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/news/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'bio',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/bio/_/id/2976212/stefon-diggs'
												},
												{
													'rel': [
														'overview',
														'desktop',
														'athlete'
													],
													'href': 'http://www.espn.com/nfl/player/_/id/2976212/stefon-diggs'
												}
											],
											'headshot': 'https://a.espncdn.com/i/headshots/nfl/players/full/2976212.png',
											'jersey': '14',
											'position': {
												'abbreviation': 'WR'
											},
											'team': {
												'id': '2'
											},
											'active': true
										},
										'team': {
											'id': '2'
										}
									}
								]
							}
						],
						'format': {
							'regulation': {
								'periods': 4
							}
						},
						'startDate': '2023-01-08T18:00Z',
						'geoBroadcasts': [
							{
								'type': {
									'id': '1',
									'shortName': 'TV'
								},
								'market': {
									'id': '1',
									'type': 'National'
								},
								'media': {
									'shortName': 'CBS'
								},
								'lang': 'en',
								'region': 'us'
							}
						]
					}
				],
				'links': [
					{
						'language': 'en-US',
						'rel': [
							'live',
							'desktop',
							'event'
						],
						'href': 'https://www.espn.com/nfl/game?gameId=401437949',
						'text': 'Gamecast',
						'shortText': 'Gamecast',
						'isExternal': false,
						'isPremium': false
					},
					{
						'language': 'en-US',
						'rel': [
							'boxscore',
							'desktop',
							'event'
						],
						'href': 'https://www.espn.com/nfl/boxscore/_/gameId/401437949',
						'text': 'Box Score',
						'shortText': 'Box Score',
						'isExternal': false,
						'isPremium': false
					},
					{
						'language': 'en-US',
						'rel': [
							'pbp',
							'desktop',
							'event'
						],
						'href': 'https://www.espn.com/nfl/playbyplay/_/gameId/401437949',
						'text': 'Play-by-Play',
						'shortText': 'Play-by-Play',
						'isExternal': false,
						'isPremium': false
					}
				],
				'weather': {
					'displayValue': 'Mostly cloudy',
					'temperature': 30,
					'highTemperature': 30,
					'conditionId': '6',
					'link': {
						'language': 'en-US',
						'rel': [
							'14127'
						],
						'href': 'http://www.accuweather.com/en/us/highmark-stadium-ny/14127/current-weather/43037_poi?lang=en-us',
						'text': 'Weather',
						'shortText': 'Weather',
						'isExternal': true,
						'isPremium': false
					}
				},
				'status': {
					'clock': 114,
					'displayClock': '1:54',
					'period': 2,
					'type': {
						'id': '2',
						'name': 'STATUS_IN_PROGRESS',
						'state': 'in',
						'completed': false,
						'description': 'In Progress',
						'detail': '1:54 - 2nd Quarter',
						'shortDetail': '1:54 - 2nd'
					}
				}
			}
		],
		week: {
			number: 1
		}
	} 
}
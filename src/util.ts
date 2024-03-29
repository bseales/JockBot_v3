import axios from 'axios'
import { ChatInputCommandInteraction } from 'discord.js'
import OddsModel from './database/models/odds'
import { NFLScoreboard, Event } from './interfaces/espn/nfl'

export function commandToClass(interaction: ChatInputCommandInteraction): string {
	//interaction.options.getSubcommand()
	const { commandName: command } = interaction

	switch(command) {
	case 'ping': 
		return 'Ping'  
	case 'nfl': 
		if(interaction.options.getSubcommand() == 'scores') {
			return 'NFLScores'
		} else if (interaction.options.getSubcommand() == 'logo') {
			return 'NFLLogo'
		} else if (interaction.options.getSubcommand() == 'odds') {
			return 'NFLOdds'
		}
		return ''
	case 'xfl': 
		if (interaction.options.getSubcommand() == 'logo') {
			return 'XFLLogo'
		} 
		return ''
	case 'claim': 
		return 'Claim'
	case 'set-nfl-odds':
		return 'SetNFLOdds'
	case 'balance': 
		return 'Balance'
	case 'bet': 
		if(interaction.options.getSubcommand() == 'nfl') {
			return 'NFLBet'
		} else if (interaction.options.getSubcommand() == 'xfl') {
			return 'XFLBet'
		} 
		return ''
	default:
		return ''
	}
}

/**
 * Returns the scoreboard JSON from the ESPN API.
 * @returns {Promise<NFLScoreboard>}
 */
export async function getNflScoreboard(): Promise<NFLScoreboard> {
	const json = await axios.get('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
	const scoreboard = json.data

	scoreboard.events.sort(function(a: Event, b: Event) {
		return new Date(a.date).getTime() - new Date(b.date).getTime()
	})

	return scoreboard
}

export async function NflOddsAlreadySetThisWeek(scoreboard: NFLScoreboard): Promise<boolean> {
	const { number: weekNumber } = scoreboard.week
	const { type: weekType } = scoreboard.season

	return await OddsModel.find({
		eventWeek: weekNumber,
		eventWeekType: weekType
	}).count() > 0
}

export function NFLSeasonTypeToString(seasonType: number): string {
	switch(seasonType) {
	case 1: return ' Preseason'
	case 3: return ' Postseason'
	
	default: return ''
	}
}

export function getNflEspnIdByName(teamName: string): number | null {
	teamName = teamName.toLowerCase()
	
	switch(teamName) {
	case 'cardinals':       return 22
	case 'falcons':         return 1
	case 'bills':           return 2
	case 'bears':           return 3
	case 'bengals':         return 4
	case 'browns':          return 5
	case 'cowboys':         return 6
	case 'broncos':         return 7
	case 'lions':           return 8
	case 'packers':         return 9
	case 'colts':           return 11
	case 'chiefs':          return 12
	case 'raiders':         return 13
	case 'chargers':        return 24
	case 'rams':            return 14
	case 'dolphins':        return 15
	case 'vikings':         return 16
	case 'patriots':        return 17
	case 'saints':          return 18
	case 'giants':          return 19
	case 'jets':            return 20
	case 'eagles':          return 21
	case 'steelers':        return 23
	case '49ers':           return 25
	case 'titans':          return 10
	case 'seahawks':        return 26
	case 'buccaneers':      return 27
	case 'commanders':      return 28
	case 'panthers':        return 29
	case 'jaguars':         return 30
	case 'ravens':          return 33
	case 'texans':          return 34

	default:                return null
	}
}

export function getXflEspnIdByName(teamName: string): number | null {
	switch(teamName) {
	case 'renegades': 	return 112647
	case 'vipers': 		return 126747
	case 'roughnecks': 	return 112648
	case 'guardians':	return 126748
	case 'brahmas':		return 126746
	case 'battlehawks':	return 112651
	case 'defenders':	return 112646
	case 'dragons':		return 112652

	default: return null
	}
}

export function formatAMPM(date: Date) {
	let hours = date.getHours()
	const minutes = date.getMinutes()
	const ampm = hours >= 12 ? 'pm' : 'am'
	hours = hours % 12
	hours = hours ? hours : 12 // the hour '0' should be '12'
	const minutesString = minutes < 10 ? '0'+minutes : minutes
	const strTime = hours + ':' + minutesString + ' ' + ampm + ' EST'
	return strTime
}

export function dayNumberToName(day: number): string {
	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
}
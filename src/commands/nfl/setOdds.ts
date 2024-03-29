import axios from 'axios'
import { ChatInputCommandInteraction } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'
import { NFLScoreboard } from 'src/interfaces/espn/nfl'
import { NFLEvent } from 'src/interfaces/espn/nflEvent'
import { americanOddsToDecimal } from '../../oddsConverter'
import OddsModel from '../../database/models/odds'
import { getNflScoreboard, NflOddsAlreadySetThisWeek } from '../../util'

export default class SetNFLOdds implements JockbotCommand {
	public eventWeek!: number
	public eventWeekType!: number 
	public scoreboard!: NFLScoreboard
    
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if (await this.oddsAlreadySetThisWeek()) {
			await interaction.reply('Odds already set this week.')
		} else {
			await interaction.reply('Setting odds...')
			await this.setOdds()
			await interaction.followUp('Odds set!')
		}
	}

	public async oddsAlreadySetThisWeek(): Promise<boolean> {
		const scoreboard = await this.getScoreboard()

		this.eventWeek = scoreboard.week.number
		this.eventWeekType = scoreboard.season.type
		this.scoreboard = scoreboard

		return await NflOddsAlreadySetThisWeek(scoreboard)
	}

	public async getScoreboard(): Promise<NFLScoreboard> {
		return getNflScoreboard()
	}

	public async setOdds(): Promise<void> {
		for (const event of this.scoreboard.events) {
			const info = await this.getGameInfo(event.id)
            
			await OddsModel.create({
				eventId: event.id,
				awayName: info.header.competitions[0].competitors[1].team.displayName,
				awayTeamId: info.header.competitions[0].competitors[1].team.id,
				awayTeamMultiplier: americanOddsToDecimal(info.pickcenter[0].awayTeamOdds.moneyLine),
				eventWeek: event.week.number,
				eventWeekType: event.season.type,
				gameTime: info.header.competitions[0].date,
				homeName: info.header.competitions[0].competitors[0].team.displayName,
				homeTeamId: info.header.competitions[0].competitors[0].team.id, 
				homeTeamMultiplier: americanOddsToDecimal(info.pickcenter[0].homeTeamOdds.moneyLine),
			})
		}
	}

	public async getGameInfo(eventId: string): Promise<NFLEvent> {
		return (await axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`)).data
	}
}
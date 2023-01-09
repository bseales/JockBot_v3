import { CommandInteraction, EmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'
import axios from 'axios'
import { NFLScoreboard, Event } from '../../interfaces/espn/nfl'

export default class NFLScores implements JockbotCommand {
	public name = 'nfl-scores'
	public description = 'Returns live NFL scores.'

	public async execute(interaction: CommandInteraction): Promise<void> {
		const embed = await this.buildEmbed()
        
		await interaction.reply({
			embeds: [embed]
		})
	}

	public commandBuilder: SlashCommandBuilder = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

	public async getScoreboard(): Promise<NFLScoreboard> {
		const json = await axios.get('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
		const scoreboard = json.data

		scoreboard.events.sort(function(a: Event, b: Event) {
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		})

		return scoreboard
	}

	public async buildEmbed(): Promise<EmbedBuilder> {
		const scoreboard = await this.getScoreboard()
		const { number: weekNumber } = scoreboard.week
		const embedFields = this.getEmbedFields(scoreboard)

		return new EmbedBuilder({
			title: `Scores for NFL Week ${weekNumber}`,
			fields: embedFields
		})
	}

	public getEmbedFields(scoreboard: NFLScoreboard): EmbedField[] {
		const embedFields: EmbedField[] = []

		for (const game of scoreboard.events) {
			const { shortDisplayName: awayTeamName } = game.competitions[0].competitors[1].team
			const { score: awayTeamScore } = game.competitions[0].competitors[1]
			const { shortDisplayName: homeTeamName } = game.competitions[0].competitors[0].team
			const { score: homeTeamScore } = game.competitions[0].competitors[0]
			const { href: espnGamecastLink } = game.links[0]
            
			let gameInfo = `${awayTeamName}: ${awayTeamScore}\n`
			gameInfo += `${homeTeamName}: ${homeTeamScore}\n`
			gameInfo += `[ESPN Gamecast](${espnGamecastLink})`
			
			embedFields.push({
				name: `${game.shortName} | ${game.competitions[0].status.type.shortDetail}`,
				value: gameInfo,
				inline: true
			})
		}

		return embedFields
	}
}
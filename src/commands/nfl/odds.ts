import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, HexColorString } from 'discord.js'
import { getWeeklyOdds } from '../../database/models/odds'
import { JockbotCommand } from 'src/interfaces/command'
import { dayNumberToName, formatAMPM, getNflScoreboard, NFLSeasonTypeToString } from '../../util'

export default class NFLOdds implements JockbotCommand {
	private embedColor: HexColorString = '#0099ff'
    
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return

		const scoreboard = await getNflScoreboard()
		const { number: weekNumber } = scoreboard.week
		const { type: weekType } = scoreboard.season
		const oddsRecords = await getWeeklyOdds(weekNumber, weekType)

		if (!oddsRecords) {
			await interaction.reply({
				ephemeral: true,
				content: 'NFL Odds haven\'t been set yet for this week. Please let Iron Man know!'
			})

			return
		}

		
		const timesSeen: number[] = []
		let embedDescription = ''
		let lastUpdatedTime

		for (const oddsRecord of oddsRecords) {
			const gameTime = new Date(oddsRecord.gameTime)
			const offset = -300 //Timezone offset for EST in minutes.
			const gameTimeInEastern = new Date(gameTime.getTime() + (offset * 60 * 1000))
			if(!(timesSeen.includes(oddsRecord.gameTime.getTime()))) {
				embedDescription += `\n**${dayNumberToName(gameTimeInEastern.getDay())}, ${gameTimeInEastern.getMonth() + 1}/${gameTimeInEastern.getDate()} ${formatAMPM(gameTimeInEastern)}**\n`
			} 

			timesSeen.push(oddsRecord.gameTime.getTime())
			const now = new Date(Date.now())
			const kickoffInPast = now.getTime() > gameTime.getTime()

			embedDescription += (kickoffInPast ? '~~' : '') + oddsRecord.awayName + ' (' + oddsRecord.awayTeamMultiplier + 'x)' + ' @ ' + oddsRecord.homeName + ' (' + oddsRecord.homeTeamMultiplier + 'x)' + (kickoffInPast ? '~~' : '') + '\n'
        
			if(!lastUpdatedTime || (lastUpdatedTime && oddsRecord.updatedAt > lastUpdatedTime)) {
				lastUpdatedTime = oddsRecord.updatedAt
			}
		}

		const thumbnail: APIEmbedImage = {
			url: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png?w=100&h=100&transparent=true'
		}
		const embed = new EmbedBuilder({
			title:`NFL${NFLSeasonTypeToString(weekType)} Week ${weekNumber} Odds`,
			thumbnail: thumbnail,
			description: embedDescription
		}).setColor(this.embedColor)
        
		await interaction.reply({
			embeds: [embed]
		})
	}
}
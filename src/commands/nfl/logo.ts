import axios from 'axios'
import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'
import { Team } from 'src/interfaces/espn/nfl'

export default class NFLLogo implements JockbotCommand {
	public name = 'nfl-logo'
	public description = 'Returns the logo of an NFL team.'

	public commandBuilder = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
		.addStringOption(option =>
			option
				.setName('team')
				.setRequired(true)
				.setDescription('The team whose logo you would like.'))

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const test = interaction.options.getString('team')
		await interaction.reply(`team is ${test}`)
		// const embed = await this.buildEmbed(interaction)
        
		// await interaction.reply({
		// 	embeds: [embed]
		// })
	}

	// public async buildEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
	// 	const team = await this.getTeam(interaction.options.getString('team'))
		

	// 	return new EmbedBuilder({
	// 		title: team.displayName,
	// 		url: team.logos?.[0].href
	// 	})
	// }

	// public async getTeam(espnId: string): Promise<Team> {
	// 	const json = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${espnId}`)
	// 	const team = json.data

	// 	return team
	// }
    
}
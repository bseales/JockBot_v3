import axios from 'axios'
import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'
import { Team } from 'src/interfaces/espn/nfl'
import { getEspnIdByName } from '../../util'

export default class NFLLogo implements JockbotCommand {
	public name = 'nfl-logo'
	public description = 'Returns the logo of an NFL team.'
	private interaction!: ChatInputCommandInteraction

	public commandBuilder = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
		.addStringOption(option =>
			option
				.setName('team')
				.setRequired(true)
				.setDescription('The team whose logo you would like.'))

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		this.setInteraction(interaction)
		const team = this.getTeamOption()
		const espnId = getEspnIdByName(team)

		if (!espnId) {
			await interaction.reply({
				ephemeral: true,
				content: 'Invalid team name!'
			})

			return
		}

		const embed = await this.buildEmbed(espnId)
        
		await interaction.reply({
			embeds: [embed]
		})
	}

	public async buildEmbed(espnId: number): Promise<EmbedBuilder> {
		const team = await this.getTeam(espnId)
		const teamImage: APIEmbedImage = {
			url: team.logos?.[0].href || ''
		}

		return new EmbedBuilder({
			title: team.displayName,
			image: teamImage
		})
	}

	public async getTeam(espnId: number): Promise<Team> {
		const json = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${espnId}`)
		const team = json.data.team

		return team
	}

	public getTeamOption(): string {
		// Non-null assersion because Discord will enforce this required parameter.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.interaction.options.getString('team')!
	}

	public setInteraction(interaction: ChatInputCommandInteraction): void {
		this.interaction = interaction
	}
    
}
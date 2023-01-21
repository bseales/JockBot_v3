import { ChatInputCommandInteraction } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'

export default class NFLOdds implements JockbotCommand {
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply('odds')
	}
}
import { ChatInputCommandInteraction } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'

export default class Ping implements JockbotCommand {
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply('Pong!')
	}
}
import { CommandInteraction } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'

export default class Ping implements JockbotCommand {
	public name = 'ping'
	public description = 'Replies with Pong!'

	public async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply(this.getResponse())
	}

	public getName(): string {
		return this.name
	}

	public getResponse(): string {
		return 'Pong!'
	}
}
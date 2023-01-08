import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'

export default class Ping implements JockbotCommand {
	public name = 'ping'
	public description = 'Replies with Pong!'

	public commandBuilder: SlashCommandBuilder = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

	public async callback(interaction: CommandInteraction): Promise<void> {
		await interaction.reply(this.getResponse())
	}

	public getName(): string {
		return this.name
	}

	public getResponse(): string {
		return 'Pong!'
	}

	public getCommandBuilder(): SlashCommandBuilder {
		return this.commandBuilder
	}
}
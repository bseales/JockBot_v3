import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Command } from 'src/interfaces/command'

export default class Ping implements Command {
	public name = 'ping'
	public description = 'Replies with Pong!'

	public commandBuilder: SlashCommandBuilder = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

	// constructor() {
	// 	this.commandBuilder = new SlashCommandBuilder()
	// 		.setName(this.getName())
	// 		.setDescription(this.getDescription())
	// }

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Command } from 'src/interfaces/command'

export default class Ping implements Command {
	public commandBuilder: SlashCommandBuilder = new SlashCommandBuilder()
		.setName(this.getName())
		.setDescription(this.getDescription())

	// constructor() {
	// 	this.commandBuilder = new SlashCommandBuilder()
	// 		.setName(this.getName())
	// 		.setDescription(this.getDescription())
	// }

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply(this.getResponse())
	}

	public getResponse(): string {
		return 'Pong!'
	}

	public getName(): string {
		return 'ping'
	}

	public getDescription(): string {
		return 'Replies with Pong!'
	}

	public getCommandBuilder(): SlashCommandBuilder {
		return this.commandBuilder
	}
}
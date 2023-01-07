import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

class Ping {
	private commandBuilder: SlashCommandBuilder

	constructor() {
		this.commandBuilder = new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!')
	}

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply(this.getResponse())
	}

	public getResponse(): string {
		return 'Pong!'
	}
}

export = Ping
import { SlashCommandBuilder } from 'discord.js'

const JockbotCommands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns Pong!').toJSON(),

	new SlashCommandBuilder()
		.setName('nfl-scores')
		.setDescription('Returns live NFL scores.').toJSON(),

	new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claims a random amount of bux.').toJSON(),

	new SlashCommandBuilder()
		.setName('nfl-logo')
		.setDescription('Returns the logo of an NFL team.')
		.addStringOption(option =>
			option
				.setName('team')
				.setRequired(true)
				.setDescription('The team whose logo you would like.')).toJSON()
]
export default JockbotCommands
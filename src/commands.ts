import { SlashCommandBuilder } from 'discord.js'

const JockbotCommands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns Pong!').toJSON(),

	new SlashCommandBuilder()
		.setName('nfl')
		.setDescription('NFL Commands')
		.addSubcommand(subcommand => 
			subcommand
				.setName('scores')
				.setDescription('Returns live NFL scores.'))
		.addSubcommand(subcommand => 
			subcommand
				.setName('logo')
				.setDescription('Returns the logo of an NFL team.')
				.addStringOption(option =>
					option
						.setName('team')
						.setRequired(true)
						.setDescription('The team whose logo you would like.')))
		.toJSON(),

	// new SlashCommandBuilder()
	// 	.setName('nfl-scores')
	// 	.setDescription('Returns live NFL scores.').toJSON(),

	new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claims a random amount of bux.').toJSON(),

	// new SlashCommandBuilder()
	// 	.setName('nfl-logo')
	// 	.setDescription('Returns the logo of an NFL team.')
	// 	.addStringOption(option =>
	// 		option
	// 			.setName('team')
	// 			.setRequired(true)
	// 			.setDescription('The team whose logo you would like.')).toJSON(),

	new SlashCommandBuilder()
		.setName('set-nfl-odds')
		.setDescription('Sets this week\'s NFL odds.')
		.setDefaultMemberPermissions(0), // command disabled by default

	new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Returns your current balance.').toJSON(),

	new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bet on a game.')
		.addSubcommand(subcommand => 
			subcommand.setName('nfl')
				.setDescription('Bet on an NFL game.')
				.addStringOption(option =>
					option
						.setName('team')
						.setRequired(true)
						.setDescription('The team to bet on.')
				)
				.addNumberOption(amount =>
					amount
						.setName('amount')
						.setRequired(true)
						.setDescription('How much to bet.')
						.setMinValue(1)
				)
		)
		// .addSubcommand(subcommand => 
		// 	subcommand.setName('xfl')
		// 		.setDescription('Bet on an XFL game.')
		// 		.addStringOption(option =>
		// 			option
		// 				.setName('team')
		// 				.setRequired(true)
		// 				.setDescription('The team to bet on.')
		// 				.setChoices(
		// 					{ name: 'Arlington Renegades', value: 'renegades'},
		// 					{ name: 'DC Defenders', value: 'defenders' },
		// 					{ name: 'Houston Roughnecks', value: 'roughnecks'},
		// 					{ name: 'Orlando Guardians', value: 'guardians'},
		// 					{ name: 'San Antonio Brahmas', value: 'brahmas'},
		// 					{ name: 'Seattle Sea Dragons', value: 'dragons'},
		// 					{ name: 'St. Louis BattleHawks', value: 'battlehawks'},
		// 					{ name: 'Vegas Vipers', value: 'vipers'},
		// 				)
		// 		)
		// 		.addNumberOption(amount =>
		// 			amount
		// 				.setName('amount')
		// 				.setRequired(true)
		// 				.setDescription('How much to bet.')
		// 		)
		// )
		.toJSON(),
]
export default JockbotCommands
import { Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import JockbotClient from './JockbotClient'
import { commandToClass } from './util'

dotenv.config()

const client = new JockbotClient({
	intents: [GatewayIntentBits.Guilds]
})

client.once(Events.ClientReady, c => {
	console.log(`Client ready, logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	// TODO: prolly won't work tbh
	const thisclient = interaction.client as JockbotClient

	const command = thisclient.commands.get(commandToClass(interaction.commandName))

	if (!command) {
		await interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true })
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'There was an error while executing this command! Please let Iron Man know.', ephemeral: true })
	}
})

client.login(process.env.TOKEN)
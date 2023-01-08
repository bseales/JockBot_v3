import { Client, ClientOptions, Collection } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import { Command } from './interfaces/command'

export default class JockbotClient extends Client {
	public commands: Collection<string, Command>

	constructor(options: ClientOptions) {
		super(options)

		this.commands = new Collection()
		this.loadCommands()
	}

	private loadCommands(): void {
		const commandsPath = path.join(__dirname, 'commands')
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'))

		commandFiles.forEach((file) => {
			const filePath: string = path.join(commandsPath, file)
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(filePath)
			this.commands.set(command.name, command)
		})
	}
}
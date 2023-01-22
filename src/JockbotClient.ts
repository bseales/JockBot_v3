import { Client, ClientOptions, Collection } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import { JockbotCommand } from './interfaces/command'

export default class JockbotClient extends Client {
	public commands: Collection<string, JockbotCommand>

	constructor(options: ClientOptions) {
		super(options)

		this.commands = new Collection<string, JockbotCommand>()
		this.loadCommands()
	}

	private loadCommands(): void {
		const commandFolders = [
			'',
			'/nfl',
			'/xfl'
		]

		commandFolders.forEach((folder) => {
			const commandsPath = path.join(__dirname, `commands${folder}`)
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
	
			commandFiles.forEach((file) => {
				const filePath: string = path.join(commandsPath, file)
				
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const command = require(filePath)
				this.commands.set(command.default.name, new command.default())
			})
		})
	}
}
import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, HexColorString, User } from 'discord.js'
import { getUserRecord, UserDocument } from '../database/models/user'
import { JockbotCommand } from '../interfaces/command'

export default class Balance implements JockbotCommand {
	private discordUser!: User
	private userRecord!: UserDocument
	private embedColor: HexColorString = '#0099ff'

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return
		const { user: discordUser } = interaction
		this.setDiscordUser(discordUser)

		const userRecord = await getUserRecord(this.getDiscordUser(), interaction.guildId)
		
		if (!userRecord) {
			await interaction.reply('Oops! You need to run `/claim` to set up your account!')
			return
		} 

		this.userRecord = userRecord
		const embed = this.buildEmbed()

		await interaction.reply({
			embeds: [embed]
		})
		
	}

	private buildEmbed(): EmbedBuilder {
		let activeBuxBet = 0
		for (const bet of this.userRecord.bets) {
			if (!bet.isPaidOut) {
				activeBuxBet += bet.amount
			}
		}
            
		let description = `Current Balance: **${(this.userRecord.balance).toLocaleString()} bux**\n\n`
		description += `Active Bets: **${ activeBuxBet } bux**`

		const thumbnail: APIEmbedImage = {
			url: this.getDiscordUser().displayAvatarURL()
		}
					
		return new EmbedBuilder({
			title: `Balance for ${this.getDiscordUser().username}`,
			thumbnail,
			description,
			
		}).setColor(this.embedColor)
	}

	public setDiscordUser(user: User): void {
		this.discordUser = user
	}

	public getDiscordUser(): User {
		return this.discordUser
	}
}
import { APIEmbedImage, ChatInputCommandInteraction, Embed, EmbedBuilder, HexColorString, User } from 'discord.js'
import { getOrCreateUserRecord, UserDocument } from '../database/models/user'
import UserModel from '../database/models/user'
import { JockbotCommand } from 'src/interfaces/command'

export default class Claim implements JockbotCommand {
	public name = 'claim'
	public description = 'Claims a random amount of bux.'
	private diffHrs = 0
	private diffMins = 0
	private claimAmount = 0
	private userRecord!: UserDocument
	private discordUser!: User
	private interaction!: ChatInputCommandInteraction
	private embedColor: HexColorString = '#0099ff'

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return

		const { user: discordUser } = interaction
		this.discordUser = discordUser
		this.interaction = interaction

		this.userRecord = await getOrCreateUserRecord(this.discordUser, interaction.guildId)

		const embed = await this.buildEmbed()
        
		await interaction.reply({
			embeds: [embed]
		})
	}

	/**
	 * Returns the Embed to be shown to the user.
	 * @returns {EmbedBuilder}
	 */
	public async buildEmbed(): Promise<EmbedBuilder> {
		if (this.claimOnCooldown()) {
			return this.buildCooldownEmbed()
		} else {
			await this.processClaim()
			return this.buildClaimEmbed()
		}
	}

	/**
	 * Updates the User record with the claim amount.
	 */
	private async processClaim(): Promise<void> {
		this.claimAmount = this.getRandomClaimAmount()
		this.diffHrs = 2
		this.diffMins = 0

		const updatedRecord = await UserModel.findOneAndUpdate({
			userId: this.discordUser.id,
			guildId: this.interaction.guildId
		},
		{ 
			$set: {
				lastClaimedAt: this.interaction.createdAt, 
				userName: this.discordUser.username
			},
			$inc : {
				'balance' : this.claimAmount
			}
		},
		{
			new: true
		})

		if (updatedRecord) {
			this.userRecord = updatedRecord
		}
	}

	/**
	 * Returns a random value between 1 and 20.
	 * @returns {number}
	 */
	private getRandomClaimAmount(): number {
		return Math.floor(Math.random() * 20) + 1
	}

	/**
	 * Returns a formatted string for the time until next available claim. Ex: 1h 15m
	 * @returns {string}
	 */
	private getNextClaimTime(): string {
		return `${this.diffHrs}h ${this.diffMins}m`
	}

	/**
	 * Returns whether the user is on cooldown for claims.
	 * @returns {boolean}
	 */
	private claimOnCooldown(): boolean {
		const HOURS_UNTIL_NEXT_CLAIM = 2
		const lastClaimed = new Date(this.userRecord.lastClaimedAt)
		const canClaimDate = new Date(lastClaimed.getTime() + (HOURS_UNTIL_NEXT_CLAIM * 60 * 60 * 1000))
		const now = new Date(Date.now())
		const diffMs = (canClaimDate.getTime() - now.getTime())

		this.diffHrs = Math.floor((diffMs % 86400000) / 3600000) 
		this.diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)

		if (this.diffMins == 60) {
			this.diffMins = 0
			this.diffHrs += 1
		}

		return diffMs >= 0
	}

	/**
	 * Returns an Embed indicating the user claim is on cooldown.
	 * @returns {EmbedBuilder}
	 */
	private buildCooldownEmbed(): EmbedBuilder {
		let description = `Current Balance: **${(this.userRecord.balance).toLocaleString()} bux**\n\n`
		description += `Next Claim: **${this.getNextClaimTime()}**`

		const thumbnail: APIEmbedImage = {
			url: this.discordUser.displayAvatarURL()
		}
					
		return new EmbedBuilder({
			title: `⌛ Claim on Cooldown for ${this.discordUser.username}`,
			thumbnail,
			description,
			
		}).setColor(this.embedColor)
	}

	/**
	 * Returns a claim receipt Embed.
	 * @returns {EmbedBuilder}
	 */
	private buildClaimEmbed(): EmbedBuilder {
		let description = `Claim Amount: **${this.claimAmount} bux**\n`
		description += `Current Balance: **${(this.userRecord.balance).toLocaleString()} bux**\n\n`
		description += `Next Claim: **${this.getNextClaimTime()}**`
		const thumbnail: APIEmbedImage = {
			url: this.discordUser.displayAvatarURL()
		}

		return new EmbedBuilder({
			title: `Claim Receipt for ${this.discordUser.username}`,
			thumbnail,
			description,
			
		}).setColor(this.embedColor)
	}
}
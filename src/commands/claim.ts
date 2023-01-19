import { APIEmbedFooter, APIEmbedImage, ChatInputCommandInteraction, Embed, EmbedBuilder, HexColorString, User } from 'discord.js'
import { createUserRecord, getOrCreateUserRecord, getUserRecord, UserDocument } from '../database/models/user'
import UserModel from '../database/models/user'
import { JockbotCommand } from 'src/interfaces/command'

export default class Claim implements JockbotCommand {
	public name = 'claim'
	public description = 'Claims a random amount of bux.'
	private hoursUntilClaim = 0
	private minutesUntilClaim = 0
	private claimAmount = 0
	private userRecord!: UserDocument
	private discordUser!: User
	private interaction!: ChatInputCommandInteraction
	private embedColor: HexColorString = '#0099ff'

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return

		const { user: discordUser } = interaction
		this.setDiscordUser(discordUser)
		this.interaction = interaction

		const record = await getUserRecord(this.getDiscordUser(), interaction.guildId)
		let embed

		if (record) {
			this.userRecord = record
			embed = await this.buildExistingUserEmbed()
		} else {
			this.userRecord = await createUserRecord(this.getDiscordUser(), interaction.guildId)
			embed = await this.buildNewUserEmbed()
		}

		await interaction.reply({
			embeds: [embed]
		})
	}

	/**
	 * Returns the Embed to be shown to the user.
	 * @returns {Promise<EmbedBuilder>}
	 */
	public async buildExistingUserEmbed(): Promise<EmbedBuilder> {
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
	public async processClaim(): Promise<void> {
		this.claimAmount = this.getRandomClaimAmount()
		this.setHoursUntilClaim(2)
		this.setMinutesUntilClaim(0)

		const updatedRecord = await UserModel.findOneAndUpdate({
			userId: this.getDiscordUser().id,
			guildId: this.interaction.guildId
		},
		{ 
			$set: {
				lastClaimedAt: this.interaction.createdAt, 
				userName: this.getDiscordUser().username
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
	public getRandomClaimAmount(): number {
		return Math.floor(Math.random() * 20) + 1
	}

	/**
	 * Returns a formatted string for the time until next available claim. Ex: 1h 15m
	 * @returns {string}
	 */
	public getNextClaimTime(): string {
		return `${this.getHoursUntilClaim()}h ${this.getMinutesUntilClaim()}m`
	}

	/**
	 * Returns whether the user is on cooldown for claims.
	 * @returns {boolean}
	 */
	public claimOnCooldown(): boolean {
		const HOURS_UNTIL_NEXT_CLAIM = 2
		const lastClaimed = new Date(this.userRecord.lastClaimedAt)
		const canClaimDate = new Date(lastClaimed.getTime() + (HOURS_UNTIL_NEXT_CLAIM * 60 * 60 * 1000))
		const now = new Date(Date.now())
		const diffMs = (canClaimDate.getTime() - now.getTime())

		this.setHoursUntilClaim(Math.floor((diffMs % 86400000) / 3600000))
		this.setMinutesUntilClaim(Math.round(((diffMs % 86400000) % 3600000) / 60000))

		if (this.getMinutesUntilClaim() == 60) {
			this.setMinutesUntilClaim(0)
			this.setHoursUntilClaim(this.getHoursUntilClaim() + 1)
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
			url: this.getDiscordUser().displayAvatarURL()
		}
					
		return new EmbedBuilder({
			title: `⌛ Claim on Cooldown for ${this.getDiscordUser().username}`,
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
			url: this.getDiscordUser().displayAvatarURL()
		}

		return new EmbedBuilder({
			title: `Claim Receipt for ${this.getDiscordUser().username}`,
			thumbnail,
			description,
			
		}).setColor(this.embedColor)
	}

	/**
	 * Returns a claim receipt Embed.
	 * @returns {EmbedBuilder}
	 */
	private buildNewUserEmbed(): EmbedBuilder {
		this.setHoursUntilClaim(2)
		this.setMinutesUntilClaim(0)

		let description = `Claim Amount: **${this.userRecord.balance} bux**\n`
		description += `Current Balance: **${(this.userRecord.balance).toLocaleString()} bux**\n\n`
		description += `Next Claim: **${this.getNextClaimTime()}**`
		const thumbnail: APIEmbedImage = {
			url: this.getDiscordUser().displayAvatarURL()
		}
		const footer: APIEmbedFooter = {
			text: 'You have been given a first-time bonus of 350 bux to get you started!'
		}

		return new EmbedBuilder({
			title: `Claim Receipt for ${this.getDiscordUser().username}`,
			thumbnail,
			description,
			footer
		}).setColor(this.embedColor)
	} 

	/**
	 * Sets the hours until the user can claim again
	 * @see setMinutesUntilClaim 
	 * @param hours 
	 */
	public setHoursUntilClaim(hours: number): void {
		this.hoursUntilClaim = hours
	}

	/**
	 * Returns the number of hours until the user can claim again
	 * @see getMinutesUntilClaim
	 * @returns {number}
	 */
	public getHoursUntilClaim(): number {
		return this.hoursUntilClaim
	}
	
	/**
	 * Sets the minutes until the user can claim again
	 * @see setHoursUntilClaim
	 * @param minutes
	 */
	public setMinutesUntilClaim(minutes: number): void {
		this.minutesUntilClaim = minutes
	}

	/**
	 * Returns the number of minutes until the user can claim again
	 * @see getHoursUntilClaim
	 * @returns {number}
	 */
	public getMinutesUntilClaim(): number {
		return this.minutesUntilClaim
	}

	public setDiscordUser(user: User): void {
		this.discordUser = user
	}

	public getDiscordUser(): User {
		return this.discordUser
	}

	public setInteraction(interaction: ChatInputCommandInteraction): void {
		this.interaction = interaction
	}
}
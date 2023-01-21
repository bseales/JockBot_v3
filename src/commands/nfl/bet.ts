import { ChatInputCommandInteraction, User } from 'discord.js'
import { getUserRecord, UserDocument } from '../../database/models/user'
import { JockbotCommand } from 'src/interfaces/command'
import { getEspnIdByName, getNflScoreboard, NflOddsAlreadySetThisWeek } from '../../util'

export default class NFLBet implements JockbotCommand {
	private interaction!: ChatInputCommandInteraction
	private discordUser!: User
    
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return
        
		this.setInteraction(interaction)
		const team = this.getTeamOption()
		const betAmount = this.getBetAmountOption()
		const espnId = getEspnIdByName(team)
		const userRecord = await getUserRecord(this.getDiscordUser(), interaction.guildId)

		if (await this.verifyInputs(betAmount, espnId, userRecord) == false) {
			return
		}

		await this.handleBet()
	}

	private async handleBet(): Promise<void> {
		const scoreboard = await getNflScoreboard()
        
		if(await NflOddsAlreadySetThisWeek(scoreboard) == false) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'NFL Odds haven\'t been set yet for this week. Please let Iron Man know!'
			})

			return
		}

		return 
	}

	public async verifyInputs(betAmount: number, espnId: number|null, userRecord: UserDocument|null): Promise<boolean> {
		if (!espnId) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'Invalid team name!'
			})

			return false
		}

		if (betAmount <= 0) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'Amount must be greater than zero!'
			})

			return false
		}

		if (!userRecord) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'Oops! You need to run `/claim` to set up your account!'
			})
			return false
		}

		if (betAmount > userRecord.balance) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'You can\'t bet more than your balance!'
			})
			return false
		}

		return true
	}

	public getTeamOption(): string {
		// Non-null assersion because Discord will enforce this required parameter.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.interaction.options.getString('team')!
	}

	public getBetAmountOption(): number {
		// Non-null assersion because Discord will enforce this required parameter.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.interaction.options.getNumber('amount')!
	}

	public setInteraction(interaction: ChatInputCommandInteraction): void {
		this.interaction = interaction
	}

	public setDiscordUser(user: User): void {
		this.discordUser = user
	}

	public getDiscordUser(): User {
		return this.discordUser
	}
}
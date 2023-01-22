import { APIEmbedImage, ChatInputCommandInteraction, EmbedBuilder, HexColorString, User } from 'discord.js'
import { getUserRecord, UserBet, UserDocument } from '../../database/models/user'
import { JockbotCommand } from 'src/interfaces/command'
import { getEspnIdByName, getNflScoreboard, NflOddsAlreadySetThisWeek } from '../../util'
import { getWeeklyTeamOdds } from '../../database/models/odds'

export default class NFLBet implements JockbotCommand {
	private interaction!: ChatInputCommandInteraction
	private discordUser!: User
	private embedColor: HexColorString = '#0099ff'
    
	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if(!interaction.inGuild()) return
        
		this.setInteraction(interaction)
		this.setDiscordUser(interaction.user)
		const team = this.getTeamOption()
		const betAmount = this.getBetAmountOption()
		const espnTeamId = getEspnIdByName(team)
		const userRecord = await getUserRecord(this.getDiscordUser(), interaction.guildId)

		if (await this.verifyInputs(betAmount, espnTeamId, userRecord) == false) {
			return
		}

		// Because of verifyInputs above, userRecord and espnTeamId are guaranteed to be defined by now.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this.handleBet(userRecord!, espnTeamId!, betAmount)
	}

	private async handleBet(userRecord: UserDocument, espnTeamId: number, betAmount: number): Promise<void> {
		const scoreboard = await getNflScoreboard()
		const { number: weekNumber } = scoreboard.week
		const { type: weekType } = scoreboard.season
        
		if(await NflOddsAlreadySetThisWeek(scoreboard) == false) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'NFL Odds haven\'t been set yet for this week. Please let Iron Man know!'
			})

			return
		}

		const gameOdds = await getWeeklyTeamOdds(weekNumber, weekType, espnTeamId)

		if(!gameOdds) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'I don\'t have any Odds for that team this week.'
			})

			return
		}

		if (gameOdds.gameTime < new Date(Date.now())) {
			await this.interaction.reply({
				ephemeral: true,
				content: 'That game\'s official start time has already passed.'
			})
			return
		}

		let opponentTeam
		let opponentTeamId
		let team
		let teamId
		let multiplier

		if (gameOdds.homeTeamId === espnTeamId) {
			opponentTeam = gameOdds.awayName
			opponentTeamId = gameOdds.awayTeamId
			multiplier = gameOdds.homeTeamMultiplier
			team = gameOdds.homeName
			teamId = gameOdds.homeTeamId
		} else {
			opponentTeam = gameOdds.homeName
			opponentTeamId = gameOdds.homeTeamId
			multiplier = gameOdds.awayTeamMultiplier
			team = gameOdds.awayName
			teamId = gameOdds.awayTeamId
		}

		const bet: UserBet = {
			sport: 'NFL',
			eventWeek: weekNumber,
			team,
			opponentTeam,
			teamId,
			opponentTeamId,
			eventId: gameOdds.eventId,
			amount: betAmount,
			multiplier,
			isPaidOut: false,
		}

		userRecord.bets.push(bet)
		userRecord.balance -= betAmount
		userRecord.userName = this.interaction.user.username

		await userRecord.save()

		const potentialReturn = Math.ceil(betAmount * multiplier)
		const returnDifference = potentialReturn - betAmount

		let description = `Team: **${team}**\n\n`
		description += `Wager: **${betAmount.toLocaleString()} bux**\n`
		description += `Multiplier: **${multiplier}**\n`
		description += `Potential Return: **${potentialReturn} bux (+${returnDifference})**\n\n`
		description += `Current Balance: **${userRecord.balance} bux**`

		const thumbnail: APIEmbedImage = {
			url: this.getDiscordUser().displayAvatarURL()
		}

		const embed = new EmbedBuilder({
			title: `Bet Receipt for ${this.getDiscordUser().username}`,
			thumbnail,
			description
		}).setColor(this.embedColor)

		await this.interaction.reply({
			embeds: [embed]
		})

		return 
	}


	public async verifyInputs(betAmount: number, espnTeamId: number|null, userRecord: UserDocument|null): Promise<boolean> {
		if (!espnTeamId) {
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
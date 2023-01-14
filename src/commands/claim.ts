import { APIEmbedImage, CommandInteraction, EmbedBuilder, User } from 'discord.js'
import { JockbotCommand } from 'src/interfaces/command'

export default class Claim implements JockbotCommand {
	public name = 'claim'
	public description = 'Claims a random amount of bux.'

	public async execute(interaction: CommandInteraction): Promise<void> {
		const { user } = interaction
		const embed = await this.buildEmbed(user)
        
		await interaction.reply({
			embeds: [embed]
		})
	}

	public async buildEmbed(user: User): Promise<EmbedBuilder> {
		const userImage: APIEmbedImage = {
			url: user.displayAvatarURL()
		}
		return new EmbedBuilder({
			title: `Balance for ${user.username}`,
			thumbnail: userImage
		})
	}
}



// const newRecord = await UserModel.create({
// 	guildId: interaction.guildId,
// 	userId: interaction.user.id,
// 	userName: interaction.user.username,
// 	balance: 350,
// 	lastClaimedAt: Date.now(),
// 	bets: []
// })

// let output = `Current Balance: **${ (newRecord.balance).toLocaleString() } bux**\n`
// output += `Active Bets: **${ 0 } bux**`

// const balanceEmbed = new DiscordJS.MessageEmbed()
// 	.setColor('#0099ff')
// 	.setTitle(`Balance for ${interaction.user.username}`)
// 	.setDescription(output)
// 	.setThumbnail(interaction.user.displayAvatarURL())
// 	.setFooter('You have been given a first-time bonus of 350 bux to get you started!')

// return (balanceEmbed)
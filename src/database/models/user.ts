import { User } from 'discord.js'
import mongoose, { Document } from 'mongoose'
interface UserBet {
    eventWeek: number,
    team: string,
    opponentTeam: string,
    teamId: number,
    opponentTeamId: number,
    eventId: string,
    amount: number,
    multiplier: number,
    isPaidOut: boolean,
    didWin?: boolean
}

export interface UserInput {
    guildId: string,
    userId: string,
    userName: string,
    balance: number,
    lastClaimedAt: Date,
    bets: Array<UserBet>
}

export interface UserDocument extends UserInput, Document {
  updatedAt: Date;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<UserDocument>(
	{
		guildId: {
			type: String,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		userName: String,
		balance: Number,
		lastClaimedAt: Date,
		bets: Array<UserBet>
	},
	{
		timestamps: true, // to create updatedAt and createdAt
	}
)

export async function getOrCreateUserRecord(discordUser: User, guildId: string): Promise<UserDocument> {
	const record = await getUserRecord(discordUser, guildId)

	if (!record) {
		return createUserRecord(discordUser, guildId)
	}

	return record
}

export async function getUserRecord(discordUser: User, guildId: string): Promise<UserDocument | null> {
	return UserModel.findOne({ userId: discordUser.id, guildId: guildId })
}

export async function createUserRecord(discordUser: User, guildId: string): Promise<UserDocument> {
	return await UserModel.create({
		guildId: guildId,
		userId: discordUser.id,
		userName: discordUser.username,
		balance: 350,
		lastClaimedAt: Date.now(),
		bets: []
	})
}

const UserModel = mongoose.model('users', UserSchema)
export default UserModel
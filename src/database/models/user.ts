import { Document, model, Schema } from 'mongoose'

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

export interface UserModel extends Document {
    guildId: {
        type: string,
        required: true
    },
    userId: {
        type: string,
        required: true
    },
    userName: string,
    balance: number,
    lastClaimedAt: Date,
    bets: Array<UserBet>
}

export const User = new Schema({
	guildId: String,
	userId: String,
	userName: String,
	balance: Number,
	lastClaimedAt: Date,
	bets: Array, 
})

export default model<UserModel>('user', User)
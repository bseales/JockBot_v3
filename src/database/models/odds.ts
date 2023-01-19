import mongoose, { Document } from 'mongoose'

export interface OddsInput {
    eventId: string,
    awayName: string,
    awayTeamId: number,
    awayTeamMultiplier: number,
    eventWeek: number,
	eventWeekType: number,
    gameTime: Date,
    homeName: string,
    homeTeamId: number, 
    homeTeamMultiplier: number,
}

export interface OddsDocument extends OddsInput, Document {
    updatedAt: Date;
    createdAt: Date;
}

const OddsSchema = new mongoose.Schema<OddsDocument>(
	{
		eventId: {
			required: true,
			type: String
		},
		awayName: String,
		awayTeamId: Number,
		awayTeamMultiplier: Number,
		eventWeek: Number,
		eventWeekType: Number,
		gameTime: Date,
		homeName: String,
		homeTeamId: Number, 
		homeTeamMultiplier: Number,
	},
	{
		timestamps: true
	}
)

const OddsModel = mongoose.model('odds', OddsSchema)
export default OddsModel
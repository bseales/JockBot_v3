import mongoose, { Document, Types } from 'mongoose'

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

export async function getWeeklyTeamOdds(weekNumber: number, weekType: number, espnTeamId: number): Promise<OddsDocument|null> {
	return OddsModel.findOne(
		{  
			$and: [
				{ 
					$or: [
						{ homeTeamId: espnTeamId },
						{ awayTeamId: espnTeamId }
					]
				},
				{ eventWeek: weekNumber },
				{ eventWeekType: weekType }
			],
		})
}

export async function getWeeklyOdds(weekNumber: number, weekType: number): Promise<(OddsDocument & {_id: Types.ObjectId;})[]> {
	return OddsModel.find({
		eventWeek: weekNumber,
		eventWeekType: weekType
	})
}

const OddsModel = mongoose.model('odds', OddsSchema)
export default OddsModel
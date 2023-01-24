import { UserAchievement, UserDocument } from './database/models/user'

export async function getAndUnlockAchievement(id: number, userRecord: UserDocument): Promise<UserAchievement> {
	const achievements = [
		{
			id: 0,
			title: 'Free Money!',
			description: 'Claim bux for the first time.'
		}
	]

	const achievement: UserAchievement = {
		id,
		title: achievements[id].title,
		description: achievements[id].description,
		unlockedAt: new Date(Date.now())
	}

	userRecord.achievements.push(achievement)
	await userRecord.save()

	return achievement
}
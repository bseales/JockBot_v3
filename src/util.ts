export function commandToClass(command: string): string {
	switch(command) {
	case 'ping': 
		return 'Ping'  
	case 'nfl-scores':
		return 'NFLScores'
	default:
		return ''
	}
}
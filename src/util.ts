export function commandToClass(command: string): string {
	switch(command) {
	case 'ping': 
		return 'Ping'  
	case 'nfl-scores':
		return 'NFLScores'
	case 'nfl-logo':
		return 'NFLLogo'
	default:
		return ''
	}
}
export function commandToClass(command: string): string {
	switch(command) {
	case 'ping': 
		return 'Ping'  
	case 'nfl-scores':
		return 'NFLScores'
	case 'nfl-logo':
		return 'NFLLogo'
	case 'claim': 
		return 'Claim'
	case 'set-nfl-odds':
		return 'SetNFLOdds'
	default:
		return ''
	}
}

export function getEspnIdByName(teamName: string): number | null {
	teamName = teamName.toLowerCase()
	
	switch(teamName) {
	case 'cardinals':       return 22
	case 'falcons':         return 1
	case 'bills':           return 2
	case 'bears':           return 3
	case 'bengals':         return 4
	case 'browns':          return 5
	case 'cowboys':         return 6
	case 'broncos':         return 7
	case 'lions':           return 8
	case 'packers':         return 9
	case 'colts':           return 11
	case 'chiefs':          return 12
	case 'raiders':         return 13
	case 'chargers':        return 24
	case 'rams':            return 14
	case 'dolphins':        return 15
	case 'vikings':         return 16
	case 'patriots':        return 17
	case 'saints':          return 18
	case 'giants':          return 19
	case 'jets':            return 20
	case 'eagles':          return 21
	case 'steelers':        return 23
	case '49ers':           return 25
	case 'titans':          return 10
	case 'seahawks':        return 26
	case 'buccaneers':      return 27
	case 'commanders':      return 28
	case 'panthers':        return 29
	case 'jaguars':         return 30
	case 'ravens':          return 33
	case 'texans':          return 34

	default:                return null
	}
}
export function commandToClass(command: string): string {
	switch(command) {
	case 'ping': 
		return 'Ping'  
	default:
		return ''
	}
}
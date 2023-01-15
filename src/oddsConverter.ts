/**
 * Converts American-style odds to a decimal version to be used as a bet multiplier.
 * @example 335 American odds = 4.35x multiplier.
 * @param americanOdds 
 * @returns {number}
 */
export function americanOddsToDecimal(americanOdds: number): number {
	if (americanOdds > 0) {
		return parseFloat(((americanOdds / 100) + 1).toFixed(2))
	} else {
		return parseFloat(((100 / (americanOdds * -1)) + 1).toFixed(2))
	}
}
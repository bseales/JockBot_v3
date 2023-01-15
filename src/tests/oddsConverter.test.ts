import { americanOddsToDecimal } from '../oddsConverter'

describe('Odds Converter Tests', () => {
	it('positive American odds', () => {
		expect(americanOddsToDecimal(335)).toBe(4.35)
	})

	it('negative American odds', () => {
		expect(americanOddsToDecimal(-440)).toBe(1.23)
	})
})
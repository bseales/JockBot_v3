export interface Type {
    id: string;
    type: number;
    name: string;
    abbreviation: string;
}

export interface Season {
    year: number;
    startDate: string;
    endDate: string;
    type: Type;
}

export interface Logo {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
    lastUpdated: string;
}

export interface Entry {
    label: string;
    alternateLabel: string;
    detail: string;
    value: string;
    startDate: string;
    endDate: string;
}

export interface Calendar {
    label: string;
    value: string;
    startDate: string;
    endDate: string;
    entries: Entry[];
}

export interface League {
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    slug: string;
    season: Season;
    logos: Logo[];
    calendarType: string;
    calendarIsWhitelist: boolean;
    calendarStartDate: string;
    calendarEndDate: string;
    calendar: Calendar[];
}

export interface Season2 {
    type: number;
    year: number;
}

export interface Week {
    number: number;
}

export interface Season3 {
    year: number;
    type: number;
    slug: string;
}

export interface Week2 {
    number: number;
}

export interface Type2 {
    id: string;
    abbreviation: string;
}

export interface Address {
    city: string;
    state: string;
}

export interface Venue {
    id: string;
    fullName: string;
    address: Address;
    capacity: number;
    indoor: boolean;
}

export interface Venue2 {
    id: string;
}

export interface Link {
    rel: string[];
    href: string;
    text: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface Team {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    venue: Venue2;
    links: Link[];
    logo: string;
}

export interface Linescore {
    value: number;
}

export interface Record {
    name: string;
    abbreviation: string;
    type: string;
    summary: string;
}

export interface Link2 {
    rel: string[];
    href: string;
}

export interface Position {
    abbreviation: string;
}

export interface Team2 {
    id: string;
}

export interface Athlete {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link2[];
    headshot: string;
    jersey: string;
    position: Position;
    team: Team2;
    active: boolean;
}

export interface Team3 {
    id: string;
}

export interface Leader2 {
    displayValue: string;
    value: number;
    athlete: Athlete;
    team: Team3;
}

export interface Leader {
    name: string;
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
    leaders: Leader2[];
}

export interface Competitor {
    id: string;
    uid: string;
    type: string;
    order: number;
    homeAway: string;
    team: Team;
    score: string;
    linescores: Linescore[];
    statistics: any[];
    records: Record[];
    leaders: Leader[];
    winner?: boolean;
}

export interface Type3 {
    id: string;
    text: string;
    abbreviation: string;
}

export interface Team4 {
    id: string;
}

export interface Probability {
    tiePercentage: number;
    homeWinPercentage: number;
    awayWinPercentage: number;
    secondsLeft: number;
}

export interface Start {
    yardLine: number;
    text: string;
}

export interface TimeElapsed {
    displayValue: string;
}

export interface End {
    yardLine: number;
    text: string;
}

export interface Drive {
    description: string;
    start: Start;
    timeElapsed: TimeElapsed;
    end: End;
    result: string;
}

export interface Team5 {
    id: string;
}

export interface Start2 {
    yardLine: number;
    team: Team5;
}

export interface Team6 {
    id: string;
}

export interface End2 {
    yardLine: number;
    team: Team6;
}

export interface Link3 {
    rel: string[];
    href: string;
}

export interface Team7 {
    id: string;
}

export interface AthletesInvolved {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link3[];
    headshot: string;
    jersey: string;
    position: string;
    team: Team7;
}

export interface LastPlay {
    id: string;
    type: Type3;
    text: string;
    scoreValue: number;
    team: Team4;
    probability: Probability;
    drive: Drive;
    start: Start2;
    end: End2;
    statYardage: number;
    athletesInvolved: AthletesInvolved[];
}

export interface Situation {
    $ref: string;
    lastPlay: LastPlay;
    down: number;
    yardLine: number;
    distance: number;
    downDistanceText: string;
    shortDownDistanceText: string;
    possessionText: string;
    isRedZone: boolean;
    homeTimeouts: number;
    awayTimeouts: number;
    possession: string;
}

export interface Type4 {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
}

export interface Status {
    clock: number;
    displayClock: string;
    period: number;
    type: Type4;
}

export interface Broadcast {
    market: string;
    names: string[];
}

export interface Link4 {
    rel: string[];
    href: string;
}

export interface Position2 {
    abbreviation: string;
}

export interface Team8 {
    id: string;
}

export interface Athlete2 {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link4[];
    headshot: string;
    jersey: string;
    position: Position2;
    team: Team8;
    active: boolean;
}

export interface Team9 {
    id: string;
}

export interface Leader4 {
    displayValue: string;
    value: number;
    athlete: Athlete2;
    team: Team9;
}

export interface Leader3 {
    name: string;
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
    leaders: Leader4[];
}

export interface Regulation {
    periods: number;
}

export interface Format {
    regulation: Regulation;
}

export interface Type5 {
    id: string;
    shortName: string;
}

export interface Market {
    id: string;
    type: string;
}

export interface Media {
    shortName: string;
}

export interface GeoBroadcast {
    type: Type5;
    market: Market;
    media: Media;
    lang: string;
    region: string;
}

export interface Link5 {
    href: string;
}

export interface Ticket {
    summary: string;
    numberAvailable: number;
    links: Link5[];
}

export interface Provider {
    id: string;
    name: string;
    priority: number;
}

export interface Odd {
    provider: Provider;
    details: string;
    overUnder: number;
}

export interface Competition {
    id: string;
    uid: string;
    date: string;
    attendance: number;
    type: Type2;
    timeValid: boolean;
    neutralSite: boolean;
    conferenceCompetition: boolean;
    recent: boolean;
    venue: Venue;
    competitors: Competitor[];
    notes: any[];
    situation: Situation;
    status: Status;
    broadcasts: Broadcast[];
    leaders: Leader3[];
    format: Format;
    startDate: string;
    geoBroadcasts: GeoBroadcast[];
    tickets: Ticket[];
    odds: Odd[];
}

export interface Link6 {
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface Link7 {
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface Weather {
    displayValue: string;
    temperature: number;
    highTemperature: number;
    conditionId: string;
    link: Link7;
}

export interface Type6 {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
}

export interface Status2 {
    clock: number;
    displayClock: string;
    period: number;
    type: Type6;
}

export interface Event {
    id: string;
    uid: string;
    date: string;
    name: string;
    shortName: string;
    season: Season3;
    week: Week2;
    competitions: Competition[];
    links: Link6[];
    weather: Weather;
    status: Status2;
}

export interface NFLScoreboard {
    leagues: League[];
    season: Season2;
    week: Week;
    events: Event[];
}
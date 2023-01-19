export interface Type {
    id?: string;
    text?: string;
    abbreviation?: string;
    name?: string;
    state?: string;
    completed?: boolean;
    description?: string;
    detail?: string;
    shortDetail?: string;
}

export interface Season {
    year: number;
    startDate?: string;
    endDate?: string;
    type: number; // used to be Type
    slug?: string;
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

export interface Week {
    number: number;
}

export interface Address {
    city: string;
    state: string;
}

export interface Venue {
    id: string;
    fullName?: string;
    address?: Address;
    capacity?: number;
    indoor?: boolean;
}

export interface Link {
    rel?: string[];
    href?: string;
    text?: string;
    isExternal?: boolean;
    isPremium?: boolean;
    language?: string;
    shortText?: string;
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
    venue: Venue;
    links: Link[];
    logo: string;
    logos?: Logo[]
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

export interface Position {
    abbreviation: string;
}

export interface Athlete {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link[];
    headshot: string;
    jersey: string;
    position: Position;
    team: Team;
    active: boolean;
}

export interface Leader2 {
    displayValue: string;
    value: number;
    athlete: Athlete;
    team: Team;
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
    linescores?: Linescore[];
    statistics?: any[];
    records?: Record[];
    leaders?: Leader[];
    winner?: boolean;
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
    end?: End;
    result?: string;
}

export interface Start2 {
    yardLine: number;
    team: TeamIdOnly;
}

export interface End2 {
    yardLine: number;
    team: TeamIdOnly;
}

export interface AthletesInvolved {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link[];
    headshot: string;
    jersey: string;
    position: string;
    team: TeamIdOnly;
}

export interface TeamIdOnly {
    id: string
}

export interface LastPlay {
    id: string;
    type: Type;
    text: string;
    scoreValue: number;
    team: TeamIdOnly;
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
    possession?: string;
}

export interface Status {
    clock: number;
    displayClock: string;
    period: number;
    type: Type;
}

export interface Broadcast {
    market: string;
    names: string[];
}

export interface Position2 {
    abbreviation: string;
}

export interface Athlete2 {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link[];
    headshot: string;
    jersey: string;
    position: Position2;
    team: Team;
    active: boolean;
}

export interface Leader4 {
    displayValue: string;
    value: number;
    athlete: Athlete2;
    team: Team;
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

export interface Market {
    id: string;
    type: string;
}

export interface Media {
    shortName: string;
}

export interface GeoBroadcast {
    type: Type;
    market: Market;
    media: Media;
    lang: string;
    region: string;
}

export interface Ticket {
    summary: string;
    numberAvailable: number;
    links: Link[];
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
    id?: string;
    uid?: string;
    date?: string;
    attendance?: number;
    type?: Type;
    timeValid?: boolean;
    neutralSite?: boolean;
    conferenceCompetition?: boolean;
    recent?: boolean;
    venue: Venue;
    competitors: Competitor[];
    notes?: any[];
    situation: Situation;
    status: Status;
    broadcasts?: Broadcast[];
    leaders?: Leader3[];
    format?: Format;
    startDate?: string;
    geoBroadcasts?: GeoBroadcast[];
    tickets?: Ticket[];
    odds?: Odd[];
}

export interface Weather {
    displayValue: string;
    temperature: number;
    highTemperature: number;
    conditionId: string;
    link: Link;
}

export interface Event {
    id: string;
    uid: string;
    date: string;
    name: string;
    shortName: string;
    season: Season;
    week: Week;
    competitions: Competition[];
    links: Link[];
    weather?: Weather;
    status?: Status;
}

export interface NFLScoreboard {
    leagues?: League[];
    season: Season;
    week: Week;
    events: Event[];
}
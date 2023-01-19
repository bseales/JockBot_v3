export interface Team2 {
    id: string;
    uid: string;
    slug: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logo: string;
}

export interface Statistic {
    name: string;
    displayValue: string;
    label: string;
}

export interface Team {
    team: Team2;
    statistics: Statistic[];
}

export interface Team3 {
    id: string;
    uid: string;
    slug: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logo: string;
}

export interface Link {
    rel: string[];
    href: string;
    text: string;
}

export interface Athlete2 {
    id: string;
    uid: string;
    guid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    links: Link[];
}

export interface Athlete {
    athlete: Athlete2;
    stats: string[];
}

export interface Statistic2 {
    name: string;
    keys: string[];
    text: string;
    labels: string[];
    descriptions: string[];
    athletes: Athlete[];
    totals: string[];
}

export interface Player {
    team: Team3;
    statistics: Statistic2[];
}

export interface Boxscore {
    teams: Team[];
    players: Player[];
}

export interface Regulation {
    periods: number;
    displayName: string;
    slug: string;
    clock: number;
}

export interface Overtime {
    periods: number;
    displayName: string;
    slug: string;
    clock: number;
}

export interface Format {
    regulation: Regulation;
    overtime: Overtime;
}

export interface Address {
    city: string;
    state: string;
    zipCode: string;
}

export interface Image {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
}

export interface Venue {
    id: string;
    fullName: string;
    address: Address;
    capacity: number;
    grass: boolean;
    images: Image[];
}

export interface Position {
    name: string;
    displayName: string;
    id: string;
}

export interface Official {
    fullName: string;
    displayName: string;
    position: Position;
    order: number;
}

export interface GameInfo {
    venue: Venue;
    attendance: number;
    officials: Official[];
}

export interface Logo {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
    lastUpdated: string;
}

export interface Team4 {
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    logos: Logo[];
}

export interface Period {
    type: string;
    number: number;
}

export interface Clock {
    displayValue: string;
}

export interface Start {
    period: Period;
    clock: Clock;
    yardLine: number;
    text: string;
}

export interface Period2 {
    type: string;
    number: number;
}

export interface Clock2 {
    displayValue: string;
}

export interface End {
    period: Period2;
    clock: Clock2;
    yardLine: number;
    text: string;
}

export interface TimeElapsed {
    displayValue: string;
}

export interface Type {
    id: string;
    text: string;
    abbreviation: string;
}

export interface Period3 {
    number: number;
}

export interface Clock3 {
    displayValue: string;
}

export interface Team5 {
    id: string;
}

export interface Start2 {
    down: number;
    distance: number;
    yardLine: number;
    yardsToEndzone: number;
    team: Team5;
    downDistanceText: string;
    shortDownDistanceText: string;
    possessionText: string;
}

export interface Team6 {
    id: string;
}

export interface End2 {
    down: number;
    distance: number;
    yardLine: number;
    yardsToEndzone: number;
    team: Team6;
    downDistanceText: string;
    shortDownDistanceText: string;
    possessionText: string;
}

export interface ScoringType {
    name: string;
    displayName: string;
    abbreviation: string;
}

export interface PointAfterAttempt {
    id: number;
    text: string;
    abbreviation: string;
    value: number;
}

export interface Play {
    id: string;
    sequenceNumber: string;
    type: Type;
    text: string;
    awayScore: number;
    homeScore: number;
    period: Period3;
    clock: Clock3;
    scoringPlay: boolean;
    priority: boolean;
    modified: string;
    wallclock: Date;
    start: Start2;
    end: End2;
    statYardage: number;
    scoringType: ScoringType;
    pointAfterAttempt: PointAfterAttempt;
}

export interface Previou {
    id: string;
    description: string;
    team: Team4;
    start: Start;
    end: End;
    timeElapsed: TimeElapsed;
    yards: number;
    isScore: boolean;
    offensivePlays: number;
    result: string;
    shortDisplayResult: string;
    displayResult: string;
    plays: Play[];
}

export interface Drives {
    previous: Previou[];
}

export interface Link2 {
    href: string;
    text: string;
}

export interface Team7 {
    id: string;
    uid: string;
    displayName: string;
    abbreviation: string;
    links: Link2[];
    logo: string;
}

export interface Link3 {
    rel: string[];
    href: string;
    text: string;
}

export interface Headshot {
    href: string;
    alt: string;
}

export interface Position2 {
    abbreviation: string;
}

export interface Team8 {
    $ref: string;
}

export interface Athlete3 {
    id: string;
    uid: string;
    guid: string;
    lastName: string;
    fullName: string;
    displayName: string;
    shortName: string;
    links: Link3[];
    headshot: Headshot;
    jersey: string;
    position: Position2;
    team: Team8;
}

export interface Leader3 {
    displayValue: string;
    athlete: Athlete3;
}

export interface Leader2 {
    name: string;
    displayName: string;
    leaders: Leader3[];
}

export interface Leader {
    team: Team7;
    leaders: Leader2[];
}

export interface HomeTeam {
    id: string;
    gameProjection: string;
    teamChanceLoss: string;
    teamChanceTie: string;
}

export interface AwayTeam {
    id: string;
    gameProjection: string;
    teamChanceLoss: string;
    teamChanceTie: string;
}

export interface Predictor {
    header: string;
    homeTeam: HomeTeam;
    awayTeam: AwayTeam;
}

export interface Provider {
    id: string;
    name: string;
    priority: number;
}

export interface SpreadRecord {
    wins: number;
    losses: number;
    pushes: number;
    summary: string;
}

export interface AwayTeamOdds {
    favorite: boolean;
    underdog: boolean;
    moneyLine: number;
    spreadOdds: number;
    teamId: string;
    winPercentage?: number;
    averageScore?: number;
    spreadRecord: SpreadRecord;
}

export interface SpreadRecord2 {
    wins: number;
    losses: number;
    pushes: number;
    summary: string;
}

export interface HomeTeamOdds {
    favorite: boolean;
    underdog: boolean;
    moneyLine: number;
    spreadOdds: number;
    teamId: string;
    winPercentage?: number;
    averageScore?: number;
    spreadRecord: SpreadRecord2;
}

export interface Pickcenter {
    provider: Provider;
    details: string;
    overUnder: number;
    spread: number;
    awayTeamOdds: AwayTeamOdds;
    homeTeamOdds: HomeTeamOdds;
    links: any[];
}

export interface Link4 {
    href: string;
    text: string;
}

export interface Team9 {
    id: string;
    uid: string;
    displayName: string;
    abbreviation: string;
    links: Link4[];
    logo: string;
}

export interface AgainstTheSpread {
    team: Team9;
    records: any[];
}

export interface Winprobability {
    tiePercentage: number;
    homeWinPercentage: number;
    secondsLeft: number;
    playId: string;
}

export interface Type2 {
    id: string;
    text: string;
    abbreviation: string;
}

export interface Period4 {
    number: number;
}

export interface Clock4 {
    value: number;
    displayValue: string;
}

export interface Link5 {
    href: string;
    text: string;
}

export interface Team10 {
    id: string;
    uid: string;
    displayName: string;
    abbreviation: string;
    links: Link5[];
    logo: string;
}

export interface ScoringType2 {
    name: string;
    displayName: string;
    abbreviation: string;
}

export interface ScoringPlay {
    id: string;
    type: Type2;
    text: string;
    awayScore: number;
    homeScore: number;
    period: Period4;
    clock: Clock4;
    team: Team10;
    scoringType: ScoringType2;
}

export interface Season {
    year: number;
    type: number;
}

export interface Logo2 {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
    lastUpdated: string;
}

export interface Link6 {
    rel: string[];
    href: string;
    text: string;
}

export interface Team11 {
    id: string;
    uid: string;
    location: string;
    name: string;
    nickname: string;
    abbreviation: string;
    displayName: string;
    color: string;
    alternateColor: string;
    logos: Logo2[];
    links: Link6[];
}

export interface Linescore {
    displayValue: string;
}

export interface Record {
    type: string;
    summary: string;
    displayValue: string;
}

export interface Competitor {
    id: string;
    uid: string;
    order: number;
    homeAway: string;
    winner: boolean;
    team: Team11;
    score: string;
    linescores: Linescore[];
    record: Record[];
    possession: boolean;
}

export interface Type3 {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
}

export interface Status {
    type: Type3;
}

export interface Type4 {
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

export interface Broadcast {
    type: Type4;
    market: Market;
    media: Media;
    lang: string;
    region: string;
}

export interface Competition {
    id: string;
    uid: string;
    date: string;
    neutralSite: boolean;
    conferenceCompetition: boolean;
    boxscoreAvailable: boolean;
    commentaryAvailable: boolean;
    liveAvailable: boolean;
    onWatchESPN: boolean;
    recent: boolean;
    boxscoreSource: string;
    playByPlaySource: string;
    competitors: Competitor[];
    status: Status;
    broadcasts: Broadcast[];
}

export interface Link7 {
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface Link8 {
    rel: string[];
    href: string;
    text: string;
}

export interface League {
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    slug: string;
    isTournament: boolean;
    links: Link8[];
}

export interface Header {
    id: string;
    uid: string;
    season: Season;
    timeValid: boolean;
    competitions: Competition[];
    links: Link7[];
    week: number;
    league: League;
    gameNote: string;
}

export interface Link9 {
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface News2 {
    href: string;
}

export interface Self {
    href: string;
}

export interface Api {
    news: News2;
    self: Self;
}

export interface Short {
    href: string;
}

export interface Web {
    href: string;
    short: Short;
}

export interface Mobile {
    href: string;
}

export interface Links {
    api: Api;
    web: Web;
    mobile: Mobile;
}

export interface Leagues {
    href: string;
}

export interface Api2 {
    leagues: Leagues;
}

export interface Leagues2 {
    href: string;
}

export interface Web2 {
    leagues: Leagues2;
}

export interface Leagues3 {
    href: string;
}

export interface Mobile2 {
    leagues: Leagues3;
}

export interface Links2 {
    api: Api2;
    web: Web2;
    mobile: Mobile2;
}

export interface League2 {
    id: number;
    description: string;
    links: Links2;
}

export interface Teams {
    href: string;
}

export interface Api3 {
    teams: Teams;
}

export interface Teams2 {
    href: string;
}

export interface Web3 {
    teams: Teams2;
}

export interface Teams3 {
    href: string;
}

export interface Mobile3 {
    teams: Teams3;
}

export interface Links3 {
    api: Api3;
    web: Web3;
    mobile: Mobile3;
}

export interface Team12 {
    id: number;
    description: string;
    links: Links3;
}

export interface Athletes {
    href: string;
}

export interface Api4 {
    athletes: Athletes;
}

export interface Athletes2 {
    href: string;
}

export interface Web4 {
    athletes: Athletes2;
}

export interface Athletes3 {
    href: string;
}

export interface Mobile4 {
    athletes: Athletes3;
}

export interface Links4 {
    api: Api4;
    web: Web4;
    mobile: Mobile4;
}

export interface Athlete4 {
    id: number;
    description: string;
    links: Links4;
}

export interface Category {
    id: number;
    description: string;
    type: string;
    sportId: number;
    leagueId: number;
    league: League2;
    uid: string;
    createDate: Date;
    teamId?: number;
    team: Team12;
    athleteId?: number;
    athlete: Athlete4;
    topicId?: number;
    guid: string;
}

export interface Image2 {
    name: string;
    width: number;
    alt: string;
    id: number;
    credit: string;
    type: string;
    url: string;
    height: number;
    ratio: string;
    caption: string;
}

export interface Article {
    description: string;
    type: string;
    premium: boolean;
    links: Links;
    categories: Category[];
    headline: string;
    byline: string;
    images: Image2[];
    published: Date;
    lastModified: Date;
}

export interface News {
    header: string;
    link: Link9;
    articles: Article[];
}

export interface Ad {
    sport: string;
    bundle: string;
}

export interface Tracking {
    sportName: string;
    leagueName: string;
    coverageType: string;
    trackingName: string;
    trackingId: string;
}

export interface TimeRestrictions {
    embargoDate: Date;
    expirationDate: Date;
}

export interface DeviceRestrictions {
    type: string;
    devices: string[];
}

export interface Leagues4 {
    href: string;
}

export interface Api5 {
    leagues: Leagues4;
}

export interface Leagues5 {
    href: string;
}

export interface Web5 {
    leagues: Leagues5;
}

export interface Leagues6 {
    href: string;
}

export interface Mobile5 {
    leagues: Leagues6;
}

export interface Links5 {
    api: Api5;
    web: Web5;
    mobile: Mobile5;
}

export interface League3 {
    id: number;
    description: string;
    links: Links5;
}

export interface Teams4 {
    href: string;
}

export interface Api6 {
    teams: Teams4;
}

export interface Teams5 {
    href: string;
}

export interface Web6 {
    teams: Teams5;
}

export interface Teams6 {
    href: string;
}

export interface Mobile6 {
    teams: Teams6;
}

export interface Links6 {
    api: Api6;
    web: Web6;
    mobile: Mobile6;
}

export interface Team13 {
    id: number;
    description: string;
    links: Links6;
}

export interface Athletes4 {
    href: string;
}

export interface Api7 {
    athletes: Athletes4;
}

export interface Athletes5 {
    href: string;
}

export interface Web7 {
    athletes: Athletes5;
}

export interface Athletes6 {
    href: string;
}

export interface Mobile7 {
    athletes: Athletes6;
}

export interface Links7 {
    api: Api7;
    web: Web7;
    mobile: Mobile7;
}

export interface Athlete5 {
    id: number;
    description: string;
    links: Links7;
}

export interface Category2 {
    id: number;
    description: string;
    type: string;
    sportId: number;
    topicId: number;
    leagueId?: number;
    league: League3;
    uid: string;
    teamId?: number;
    team: Team13;
    athleteId?: number;
    athlete: Athlete5;
}

export interface Default {
    href: string;
    width: number;
    height: number;
}

export interface Full {
    href: string;
}

export interface Wide {
    href: string;
}

export interface Square {
    href: string;
}

export interface PosterImages {
    default: Default;
    full: Full;
    wide: Wide;
    square: Square;
}

export interface Image3 {
    name: string;
    url: string;
    alt: string;
    caption: string;
    credit: string;
    width: number;
    height: number;
}

export interface Self2 {
    href: string;
}

export interface Artwork {
    href: string;
}

export interface Api8 {
    self: Self2;
    artwork: Artwork;
}

export interface Short2 {
    href: string;
}

export interface Self3 {
    href: string;
}

export interface Web8 {
    href: string;
    short: Short2;
    self: Self3;
}

export interface Mezzanine {
    href: string;
}

export interface Flash {
    href: string;
}

export interface Hds {
    href: string;
}

export interface HD {
    href: string;
}

export interface HLS {
    href: string;
    HD: HD;
}

export interface HD2 {
    href: string;
}

export interface Full2 {
    href: string;
}

export interface Source {
    mezzanine: Mezzanine;
    flash: Flash;
    hds: Hds;
    HLS: HLS;
    HD: HD2;
    full: Full2;
    href: string;
}

export interface Alert {
    href: string;
}

export interface Source2 {
    href: string;
}

export interface Streaming {
    href: string;
}

export interface ProgressiveDownload {
    href: string;
}

export interface Mobile8 {
    alert: Alert;
    source: Source2;
    href: string;
    streaming: Streaming;
    progressiveDownload: ProgressiveDownload;
}

export interface Links8 {
    api: Api8;
    web: Web8;
    source: Source;
    mobile: Mobile8;
}

export interface Video {
    source: string;
    id: number;
    dataSourceIdentifier: string;
    headline: string;
    caption: string;
    description: string;
    premium: boolean;
    ad: Ad;
    tracking: Tracking;
    cerebroId: string;
    lastModified: Date;
    originalPublishDate: Date;
    timeRestrictions: TimeRestrictions;
    deviceRestrictions: DeviceRestrictions;
    syndicatable: boolean;
    duration: number;
    categories: Category2[];
    keywords: any[];
    posterImages: PosterImages;
    images: Image3[];
    thumbnail: string;
    links: Links8;
    title: string;
}

export interface News3 {
    href: string;
}

export interface Events {
    href: string;
}

export interface Api9 {
    news: News3;
    events: Events;
}

export interface Web9 {
    href: string;
}

export interface Sportscenter {
    href: string;
}

export interface App {
    sportscenter: Sportscenter;
}

export interface Mobile9 {
    href: string;
}

export interface Links9 {
    api: Api9;
    web: Web9;
    app: App;
    mobile: Mobile9;
}

export interface Leagues7 {
    href: string;
}

export interface Api10 {
    leagues: Leagues7;
}

export interface Leagues8 {
    href: string;
}

export interface Web10 {
    leagues: Leagues8;
}

export interface Leagues9 {
    href: string;
}

export interface Mobile10 {
    leagues: Leagues9;
}

export interface Links10 {
    api: Api10;
    web: Web10;
    mobile: Mobile10;
}

export interface League4 {
    id: number;
    description: string;
    links: Links10;
}

export interface Teams7 {
    href: string;
}

export interface Api11 {
    teams: Teams7;
}

export interface Teams8 {
    href: string;
}

export interface Web11 {
    teams: Teams8;
}

export interface Teams9 {
    href: string;
}

export interface Mobile11 {
    teams: Teams9;
}

export interface Links11 {
    api: Api11;
    web: Web11;
    mobile: Mobile11;
}

export interface Team14 {
    id: number;
    description: string;
    links: Links11;
}

export interface Category3 {
    id: number;
    description: string;
    type: string;
    sportId: number;
    leagueId: number;
    league: League4;
    uid: string;
    teamId?: number;
    team: Team14;
}

export interface Image4 {
    name: string;
    width: number;
    alt: string;
    caption: string;
    url: string;
    height: number;
}

export interface Metric {
    count: number;
    type: string;
}

export interface Article2 {
    dataSourceIdentifier: string;
    keywords: any[];
    description: string;
    source: string;
    video: Video[];
    type: string;
    nowId: string;
    premium: boolean;
    related: any[];
    allowSearch: boolean;
    links: Links9;
    id: number;
    categories: Category3[];
    headline: string;
    gameId: string;
    images: Image4[];
    linkText: string;
    published: Date;
    allowComments: boolean;
    lastModified: Date;
    metrics: Metric[];
    inlines: any[];
    story: string;
}

export interface Ad2 {
    sport: string;
    bundle: string;
}

export interface Tracking2 {
    sportName: string;
    leagueName: string;
    coverageType: string;
    trackingName: string;
    trackingId: string;
}

export interface TimeRestrictions2 {
    embargoDate: Date;
    expirationDate: Date;
}

export interface DeviceRestrictions2 {
    type: string;
    devices: string[];
}

export interface Self4 {
    href: string;
}

export interface Artwork2 {
    href: string;
}

export interface Api12 {
    self: Self4;
    artwork: Artwork2;
}

export interface Short4 {
    href: string;
}

export interface Self5 {
    href: string;
}

export interface Web12 {
    href: string;
    short: Short4;
    self: Self5;
}

export interface Mezzanine2 {
    href: string;
}

export interface Flash2 {
    href: string;
}

export interface Hds2 {
    href: string;
}

export interface HD3 {
    href: string;
}

export interface HLS2 {
    href: string;
    HD: HD3;
}

export interface HD4 {
    href: string;
}

export interface Full3 {
    href: string;
}

export interface Source3 {
    mezzanine: Mezzanine2;
    flash: Flash2;
    hds: Hds2;
    HLS: HLS2;
    HD: HD4;
    full: Full3;
    href: string;
}

export interface Alert2 {
    href: string;
}

export interface Source4 {
    href: string;
}

export interface Streaming2 {
    href: string;
}

export interface ProgressiveDownload2 {
    href: string;
}

export interface Mobile12 {
    alert: Alert2;
    source: Source4;
    href: string;
    streaming: Streaming2;
    progressiveDownload: ProgressiveDownload2;
}

export interface Links12 {
    api: Api12;
    web: Web12;
    source: Source3;
    mobile: Mobile12;
}

export interface Video2 {
    source: string;
    id: number;
    headline: string;
    description: string;
    ad: Ad2;
    tracking: Tracking2;
    cerebroId: string;
    lastModified: Date;
    originalPublishDate: Date;
    timeRestrictions: TimeRestrictions2;
    deviceRestrictions: DeviceRestrictions2;
    duration: number;
    thumbnail: string;
    links: Links12;
}

export interface FullViewLink {
    text: string;
    href: string;
}

export interface Stat {
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    type: string;
    value: number;
    displayValue: string;
    id: string;
    summary: string;
}

export interface Logo3 {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
    lastUpdated: string;
}

export interface Entry {
    team: string;
    link: string;
    id: string;
    uid: string;
    stats: Stat[];
    logo: Logo3[];
}

export interface Standings2 {
    entries: Entry[];
}

export interface Group {
    standings: Standings2;
    header: string;
    href: string;
}

export interface Standings {
    fullViewLink: FullViewLink;
    groups: Group[];
}

export interface NFLEvent {
    boxscore: Boxscore;
    format: Format;
    gameInfo: GameInfo;
    drives: Drives;
    leaders: Leader[];
    broadcasts: any[];
    predictor: Predictor;
    pickcenter: Pickcenter[];
    againstTheSpread: AgainstTheSpread[];
    odds: any[];
    winprobability: Winprobability[];
    scoringPlays: ScoringPlay[];
    header: Header;
    news: News;
    article: Article2;
    videos: Video2[];
    standings: Standings;
}
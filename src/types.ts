export interface IUser {
    id: number
    email: string
    balance: number
    executedTasksForDay:  number
    executedTasksForWeek: number
    executedTasksForMonth: number
    discount: Number
    maxResourceLimit: Number
    loadLimit: Number
    accountCreatedAt: Date
}

/**
 * @name User
 * @type {{
 *     id: Number,
 *     email: String,
 *     balance: Number,
 *     executedTasksForDay: Number,
 *     executedTasksForWeek: Number,
 *     executedTasksForMonth: Number,
 *     discount: Number,
 *     maxResourceLimit: Number,
 *     loadLimit: Number,
 *     accountCreatedAt: Date,
 * }}
 */

export interface IProject {
    id: number,
    userId: number,
    siteAddress: string,
    searchEngine: string,
    searchingRange: "100" | "200",
    parsingTime: Date,
    parsingDays: string,
    queriesCount: number,
    lastCollection: Date | null
    marker: string
}
/**
 * @name Project
 * @type {{
 *     id: Number,
 *     userId: Number,
 *     siteAddress: String,
 *     searchEngine: String,
 *     searchingRange: "100" | "200",
 *     parsingTime: Date,
 *     parsingDays: String,
 *     queriesCount: Number,
 * }}
 */

export interface IGroup {
    id: number,
    projectId: number,
    groupName: string,
    queriesCount: number
    subgroups: ISubgroup[]
    marker: string
}

/**
 * @name Group
 * @type {{
 *     id: Number,
 *     projectId: Number,
 *     groupName: String,
 *     queriesCount: Number
 * }}
 */

export interface ISubgroup {
    id: number,
    groupId: number,
    subgroupName: string,
    queriesCount: number
    marker: string
}
/**
 * @name Subgroup
 * @type {{
 *     id: Number,
 *     groupId: Number,
 *     subgroupName: String,
 *     queriesCount: Number
 * }}
 */

export interface ICity {
    id: number,
    projectId: number,
    cityName: string,
}

/**
 * @name City
 * @type {{
 *     id: Number,
 *     projectId: Number,
 *     cityName: String,
 * }}
 */

export interface ISearchingQuery {
    id: number,
    groupId: number,
    queryText: string,
    subgroupId: number,
    frequency?: number
}

/**
 * @name SearchingQuery
 * @type {{
 *     id: Number,
 *     groupId: Number,
 *     queryText: String,
 * }}
 */

export interface IPosition {
    id: number,
    queryId: number,
    subgroupId: number,
    place: number,
    lastCollection: Date,
    queryText: string,
    cityCollection: string,
    groupId: number,
    projectId: number,
    engineCollection: string,
    foundAddress: string
}
/**
 * @name Position
 * @type {{
 *     id: Number,
 *     queryId: Number,
 *     subgroupId: Number,
 *     place: Number,
 *     lastCollection: Date,
 *     queryText: String,
 *     cityCollection: String,
 *     groupId: Number,
 *     projectId: Number,
 *     engineCollection: String,
 *     foundAddress: String
 * }}
 */

export type XLSXImportQuery = [string, string, string?]
/**
 * @name XLSXImportQuery
 * @type {
 *     [String, String, String?]
 * }
 */

export interface IFrequency {
    id: number
    queryText: string
    cityName: string
    frequency: number
}
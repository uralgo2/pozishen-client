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
    id: Number,
    projectId: Number,
    groupName: String,
    queriesCount: Number
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
    id: Number,
    groupId: Number,
    subgroupName: String,
    queriesCount: Number
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
    id: Number,
    projectId: Number,
    cityName: String,
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
    id: Number,
    groupId: Number,
    queryText: String,
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
    id: Number,
    queryId: Number,
    subgroupId: Number,
    place: Number,
    lastCollection: Date,
    queryText: String,
    cityCollection: String,
    groupId: Number,
    projectId: Number,
    engineCollection: String,
    foundAddress: String
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

export type XLSXImportQuery = [String, String, String?]
/**
 * @name XLSXImportQuery
 * @type {
 *     [String, String, String?]
 * }
 */

import {
    ICity,
    IFrequency,
    IGroup,
    IPosition,
    IProject,
    ISearchingQuery,
    ISubgroup,
    IUser,
    XLSXImportQuery
} from "./types";
export type Union<T, T1> = T | T1

export interface ApiException {
    message: string
}

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE'
}

export class Api {
    public static readonly host: string = 'https://pozishen.ru/'
    public static get secret(): string {
        // @ts-ignore
        return getCookie('c')
    }
    public static set secret(value: string) {
        // @ts-ignore
        setCookie('c', value)
    }
    private static async request<ReturnType>(
        path: string,
        method: HttpMethod = HttpMethod.Get,
        queryParams: any = {},
        bodyParams: any = {},
        pathParams: any = {},
    ): Promise<Union<ApiException, ReturnType>>
    {
        const url = this.host.endsWith('/')
            ? this.host
            : this.host + '/'

        let query = '?'

        for(const qp of Object.keys(queryParams))
            query += encodeURI(qp) + '=' + encodeURI(queryParams[qp] + '&')

        let pathString = path
        for(const pp of Object.keys(pathParams))
            pathString = pathString.replace(':' + pp, pathParams[pp])

        const body = JSON.stringify(bodyParams) === '{}' ? undefined : JSON.stringify(bodyParams)


        const result = await fetch(new URL(pathString + query, url).toString(), {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: body,
        })

        const text = await result.text()

        //console.log(text)

        const json = JSON.parse(text)

        if(!json.successful)
            return json as ApiException
        else
            return json.data as ReturnType
    }

    public static async GetMe() {
        return await Api.request<IUser>('/api/getMe', HttpMethod.Get, {
            c: this.secret
        })
    }

    public static async GetProjects() {
        return await Api.request<IProject[]>('/api/getProjects', HttpMethod.Get, {
            c: this.secret
        })
    }

    public static async GetProject(id: number) {
        return await Api.request<IProject>('/api/getProject', HttpMethod.Get, {
            c: this.secret,
            projectId: id
        })
    }

    public static async GetGroups(projectId: number) {
        return await Api.request<IGroup[]>('/api/getGroups', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId
        })
    }

    public static async GetCities(projectId: number) {
        return await Api.request<ICity[]>('/api/getCities', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId
        })
    }

    public static async GetSubgroups(groupId: number) {
        return await Api.request<ISubgroup[]>('/api/getSubgroups', HttpMethod.Get, {
            c: this.secret,
            groupId: groupId
        })
    }

    public static async GetQueries(projectId: number, groupId: number, subgroupId: number = 0, page: number = 0){
        return await Api.request<ISearchingQuery[]>('/api/getQueries', HttpMethod.Get, {
            c: this.secret,
            groupId: groupId,
            subgroupId: subgroupId,
            p: page,
            projectId: projectId
        })
    }

    public static async AddGroup(projectId: number, name: string){
        return await Api.request<IGroup>('/api/addGroup', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId,
            name: name
        })
    }

    public static async AddSubgroup(groupId: number, name: string){
        return await Api.request<IGroup>('/api/addSubgroup', HttpMethod.Get, {
            c: this.secret,
            groupId: groupId,
            name: name
        })
    }

    public static async AddQueries(projectId: number, texts: string[], groupId: number, subgroupId = 0){
        return await Api.request<ISearchingQuery[]>('/api/addQueries', HttpMethod.Post,  {},{
            c: this.secret,
            projectId: projectId,
            texts: texts,
            groupId: groupId,
            subgroupId: subgroupId
        })
    }

    public static async DeleteGroup(projectId: number, groupId: number){
        return await Api.request('/api/deleteGroup', HttpMethod.Get, {
            c: this.secret,
            groupId: groupId,
            projectId: projectId
        })
    }

    public static async DeleteSubgroup(subgroupId: number){
        return await Api.request('/api/deleteSubgroup', HttpMethod.Get, {
            c: this.secret,
            subgroupId: subgroupId,
        })
    }

    public static async DeleteProject(projectId: number){
        return await Api.request('/api/deleteProject', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId,
        })
    }

    public static async CollectProject(projectId: number){
        return await Api.request('/api/collect', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId,
        })
    }

    public static async DeleteQuery(projectId: number, groupId: number, queryId: number){
        return await Api.request('/api/deleteQuery', HttpMethod.Get, {
            c: this.secret,
            groupId: groupId,
            projectId: projectId,
            queryId: queryId
        })
    }

    public static async AddQueriesXLSX(projectId: number, data: XLSXImportQuery[]){
        return await Api.request<ISearchingQuery[]>('/api/addQueriesXLSX', HttpMethod.Post,  {},{
            c: this.secret,
            projectId: projectId,
            data: data
        })
    }

    public static async SearchCities(search: string, count: number){
        return await Api.request<{name: string}[]>('/api/searchCities', HttpMethod.Get, {
            c: this.secret,
            search: search,
            count: count
        })
    }

    public static async AddProject(data: any){
        return await Api.request<IProject>('/api/addProject', HttpMethod.Post,  {},{
            c: this.secret,
            project: data
        })
    }
    public static async UpdateProject(id: number, data: any){
        return await Api.request<IProject>('/api/updateProject', HttpMethod.Post,  {},{
            c: this.secret,
            projectId: id,
            project: data
        })
    }
    public static async GetPositions(projectId: number,
                                     city: string,
                                     engine: string,
                                     to: Date,
                                     from: Date,
                                     groupId = 0,
                                     subgroupId = 0,
                                     page = 0) {
        return await Api.request<IPosition[]>('/api/getPositions', HttpMethod.Get,{
            c: this.secret,
            projectId: projectId,
            city: city,
            engine: engine,
            to: to.toISOString().split('T')[0],
            from: from.toISOString().split('T')[0],
            groupId: groupId,
            subgroupId: subgroupId,
            p: page,
        })
    }

    public static async GetFrequency(city: string, texts: string[]){
        return await Api.request<IFrequency[]>('/api/getFrequency', HttpMethod.Post, {}, {
            c: this.secret,
            city: city,
            texts: texts
        })
    }

    public static async GetPositionsCount(projectId: number,
                                     city: string,
                                     engine: string,
                                     to: Date,
                                     from: Date,
                                     groupId = 0,
                                     subgroupId = 0,
                                     page = 0) {
        return await Api.request<number>('/api/getPositionsCount', HttpMethod.Get,{
            c: this.secret,
            projectId: projectId,
            city: city,
            engine: engine,
            to: to.toISOString().split('T')[0],
            from: from.toISOString().split('T')[0],
            groupId: groupId,
            subgroupId: subgroupId,
            p: page,
        })
    }

    public static async Login(email: string, password: string) {
        const res = await Api.request<{c: string}>('/api/login', HttpMethod.Get, {
            email: email,
            password: password,
        })

        if('message' in res)
            return res.message

        Api.secret = res.c

        return true
    }

    public static async Signup(email: string, password: string) {
        const res = await Api.request<{c: string}>('/api/signup', HttpMethod.Get, {
            email: email,
            password: password,
        })

        if('message' in res)
            return res.message

        Api.secret = res.c

        return true
    }
}
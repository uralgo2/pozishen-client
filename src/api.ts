import {IGroup, IProject, ISubgroup, IUser, XLSXImportQuery} from "./types";
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
    private static readonly host: string = 'https://pozishen.ru/admin'
    private static readonly secret: string = '3e04edacf4686ca04cd260ebffec240b640374d32f0fa46ea50741102cbed7c8'

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

    public static async GetGroups(projectId: number) {
        return await Api.request<IProject[]>('/api/getProjects', HttpMethod.Get, {
            c: this.secret,
            projectId: projectId
        })
    }
}
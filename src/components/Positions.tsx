import React, {useEffect, useState, MouseEvent, FocusEvent} from 'react'
import {Api, ApiException} from "../api";
import {IGroup, IPosition, IProject, ISearchingQuery, ISubgroup} from "../types";
import {Route, Routes, useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import '../resources/styles/positions.css'
import Sidebar from "./Sidebar";
import {Helmet} from "react-helmet";
import {offset, shift, useFloating} from "@floating-ui/react-dom";
import Percentage from "./Percentage";
import {Graphics} from "./Graphics";
import {Scrollbar} from "react-scrollbars-custom";
export enum FilterEnum {
    NameAZ,
    NameZA,
    Frequency91,
    Frequency19,
    RelevantLink,
    PurposeLink,
    PurposeRelevant,
    RelevantPurpose,
    PositionChange,
    Default
}
export default function Positions() {
    const times = [0, 1, 2, 3, 4]
    const [params] = useSearchParams()

    const navigate = useNavigate()

    const projectId = Number(params.get('id') ?? 0)

    if (!projectId)
        navigate('/projects')

    const [project, setProject] = useState<IProject>({
        id: 0,
        lastCollection: new Date(),
        marker: "",
        parsingDays: "",
        parsingTime: new Date('11:30'),
        queriesCount: 0,
        searchEngine: "",
        searchingRange: '100',
        siteAddress: "",
        userId: 0
    })

    const [days, setDays] = useState(new Set<string>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']))
    const [cities, setCities] = useState<string[]>([])
    const [groups, setGroups] = useState<IGroup[]>([])
    const [queries, setQueries] = useState<ISearchingQuery[]>([])
    const [filterSearchingEngine, setFilterSearchingEngine] = useState<'yandex' | 'google'>()
    const [filterCity, setFilterCity] = useState<string>()
    const [filterGroup, setFilterGroup] = useState<IGroup | ISubgroup>()
    const [filterDate, setFilterDate] = useState<{ to: Date|null, from: Date|null }>()
    const [data, setData] = useState<{ [date: string]: { id: number, pos: number, diff: number, chd?: boolean }[] }>({
        '06.08.22': [
            {id: 0, pos: 48, diff: +3},
            {id: 1, pos: 72, diff: -1},
            {id: 2, pos: 13, diff: -17},
            {id: 3, pos: 3, diff: 0},
        ],
        '05.08.22': [
            {id: 4, pos: 116, diff: +3},
            {id: 5, pos: 24, diff: -1},
            {id: 6, pos: 90, diff: -17},
            {id: 7, pos: 49, diff: +1},
        ],
        '04.08.22': [
            {id: 8, pos: 42, diff: +3},
            {id: 9, pos: 65, diff: -1},
            {id: 10, pos: 7, diff: -17},
            {id: 11, pos: 87, diff: +12, chd: true},
        ],
        '03.08.22': [
            {id: 12, pos: 14, diff: +3},
            {id: 13, pos: 7, diff: -1},
            {id: 14, pos: 26, diff: -17},
            {id: 15, pos: 17, diff: +1},
        ],
    })
    const [topsData, setTopsData] = useState<{[date: string]: {[x: number]: {val: number, diff: number}}}>({})
    const [querySearch, setQuerySearch] = useState<string>('')
    const [querySearchShow, setQuerySearchShow] = useState(false)
    const [groupSearch, setGroupSearch] = useState<string | null>(null)
    const [dateStep, setDateStep] = useState(0)
    const [now] = useState(new Date())
    const [editingMarkerGroup, setEditingMarkerGroup] = useState<IGroup | ISubgroup | null>(null)
    const [modal, setModal] = useState<string | null>(null)
    const [page, setPage] = useState(0)
    const [fetchingData, setFetchingData] = useState(false)
    const [queriesCount, setQueriesCount] = useState(0)

    const changeMarkerPopup = useFloating({
        placement: 'left',
        middleware: [offset({
            mainAxis: -50,
            crossAxis: 135,
        }),
            shift(),
        ],
    })

    const toggleDay = (e: MouseEvent<HTMLDivElement>) => {
        const day = e.currentTarget.getAttribute('data-name')!

        const _days = structuredClone(days)

        if(_days.has(day))
            _days.delete(day)
        else
            _days.add(day)

        setDays(_days)
    }

    const fetchGroups = async () => {
        const groups = await Api.GetGroups(projectId)

        if ('message' in groups)
            return //alert(groups.message)

        for (let group of groups) {
            const subgroups = await Api.GetSubgroups(group.id)

            if ('message' in subgroups)
                return //alert(subgroups.message)

            group.subgroups = subgroups.map(sub => {
                sub.marker = 'green'
                return sub
            })
            group.marker = 'green'
        }

        setGroups(groups)
    }

    const fetchProject = async () => {
        const res = await Api.GetProject(projectId)

        if ('message' in res)
            return

        setProject(res)

        const cities = await Api.GetCities(projectId)

        if ('message' in cities)
            return

        setCities(cities.map(city => city.cityName))
    }

    const fetchQueries = async () => {
        if(!filterGroup) {
            setQueries([])
            setData({})
            return
        }

        if('groupId' in filterGroup) {
            const queries = await Api.GetQueries(projectId, filterGroup.groupId, filterGroup.id)

            if ('message' in queries)
                return //alert(queries.message)

            if(filterCity) {
                const texts = queries.map(query => query.queryText)

                const frequencies = await Api.GetFrequency(filterCity, texts)

                if ('message' in frequencies)
                    return

                for (const frequency of frequencies) {
                    const idx = queries.findIndex(query => query.queryText.toLowerCase() === frequency.queryText.toLowerCase())

                    queries[idx].frequency = Number(frequency.frequency as any)
                }
            }

            setQueries(queries)

            await fetchData(queries)
        }
        else {
            const queries = await Api.GetQueries(projectId, filterGroup.id)

            if ('message' in queries)
                return //alert(queries.message)

            if(filterCity) {
                const texts = queries.map(query => query.queryText)

                const frequencies = await Api.GetFrequency(filterCity, texts)

                if ('message' in frequencies)
                    return

                for (const frequency of frequencies) {
                    const idx = queries.findIndex(query => query.queryText.toLowerCase() === frequency.queryText.toLowerCase())

                    queries[idx].frequency = Number(frequency.frequency)
                }
            }

            setQueries(queries)

            await fetchData(queries)
        }
    }

    const fetchData = async (queries: ISearchingQuery[]) => {
        if(!filterGroup || !filterDate?.from || !filterDate?.to) return

        const groupId = 'groupId' in filterGroup ? filterGroup.groupId : filterGroup?.id

        const subgroupId = 'groupId' in filterGroup ? filterGroup.id : 0

        const positionsCount = await Api.GetPositionsCount(project.id, filterCity!, filterSearchingEngine!, filterDate!.to!, filterDate!.from!, groupId, subgroupId, 0)

        const randomInt = () => {
            return Math.random() * Math.random() * 10000000
        }

        const repeat = function<T>(item: T, cnt: number) {
            const ar: T[] = []

            for (let i = 0; i < cnt; i++)
                ar.push(structuredClone(item))

            return ar
        }

        const data: { [date: string]: { id: number, pos: number, diff: number, chd?: boolean, foundAddress: string }[] } = {}
        let prevDate: string | null = null
        let lastDate: string | null = null

        for (let i = 0; i < positionsCount; i+=25) {
            const positions: IPosition[] | ApiException = await Api.GetPositions(project.id, filterCity!, filterSearchingEngine!, filterDate!.to!, filterDate!.from!, groupId, subgroupId, i / 25)

            if('message' in positions)
                return alert(positions.message)

            for(const {foundAddress, id, lastCollection, place, queryId} of positions){
                const date = new Date(lastCollection)
                    .toLocaleDateString('ru', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit'
                    })

                const ar = data[date]
                    ?? (data[date] = repeat({foundAddress: "", diff: 0, pos: 0, id: randomInt()}, queries.length))

                const idx = queries.findIndex(query => query.id === queryId)

                const prev = (prevDate && prevDate !== date) ? data[prevDate][idx] : null

                //console.log(idx, pos.queryText, pos.place)

                const diff = !place && prev?.pos
                    ? Number.NEGATIVE_INFINITY
                    : prev
                        ? !prev.pos && place
                            ? Number.POSITIVE_INFINITY
                            : prev.pos - place
                        : 0
                ar[idx] = {
                    foundAddress: foundAddress,
                    id: id,
                    pos: place,
                    diff: diff,
                    chd: (prev && place) ? prev.foundAddress !== foundAddress : false
                }

                if(lastDate !== date) {
                    prevDate = lastDate
                }

                lastDate = date
            }
        }

        const reverse = (_data: typeof data) => {
            const ndata: typeof data = {}

            const keys = Object.keys(_data)
                .reverse()

            for(const key of keys)
                ndata[key] = _data[key]

            return ndata
        }

        setData(reverse(data))
    }

    const showSelect = (e: FocusEvent<HTMLDivElement | HTMLLabelElement>) => {
        const opened = document.querySelector('.select-options.show')

        opened?.classList.remove('show')

        const options = e.currentTarget
            .closest('.select-container')!
            .querySelector('.select-options') as Element

        options.classList.add('show')
    }

    const focusParent = (e: FocusEvent<HTMLElement>) => {
        const focused = document.querySelector('.input-container.focus')

        focused?.classList.remove('focus')

        e
            .currentTarget
            .closest('.input-container')!
            .classList
            .add('focus')
    }

    const getColor = (pos: number) => pos === 0 || pos > 100 ? 'white'
        : pos > 50 ? 'grey'
            : pos > 20 ? 'orange'
                : pos > 10 ? 'yellow'
                    : pos > 5 ? 'green'
                        : pos > 3 ? 'blue'
                            : 'dark-blue'

    const searchParts = (str: string, searching: string) => {
        const parts = searching
            .toLowerCase()
            .split(' ')

        str = str.toLowerCase()

        for (const part of parts) {
            const pretty = part.trim()

            if (pretty.length && str.search(pretty) !== -1)
                return true
        }

        return false
    }

    const filterClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()

        const options = e.currentTarget.closest('.select-options') as HTMLDivElement

        options.classList.remove('show')

        const container = document.querySelector('.select-container .active')!

        container.classList.remove('active')

        const tools = document.querySelector('.tools')

        tools?.classList.remove('active')

        const type = Number(e.currentTarget.getAttribute('data-type')) as FilterEnum

        switch (type) {
            case FilterEnum.NameAZ:
                setQueries((queries) => {
                    const _queries: ISearchingQuery[] = structuredClone(queries)
                    _queries.sort((a, b) => {

                        const names = [a.queryText, b.queryText]

                        names.sort()

                        if (names[0] === a.queryText) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    filterData(queries, _queries)

                    return _queries
                })
                break;
            case FilterEnum.NameZA:
                setQueries((queries) => {
                    const _queries: ISearchingQuery[] = structuredClone(queries)
                    _queries.sort((a, b) => {

                        const names = [a.queryText, b.queryText]

                        names.sort()

                        if (names[1] === a.queryText) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    filterData(queries, _queries)

                    return _queries
                })
                break;
            case FilterEnum.Frequency91:
                setQueries((queries) => {
                    const _queries: ISearchingQuery[] = structuredClone(queries)
                    _queries.sort((a1, b1) => {
                        const a = a1.frequency || 0
                        const b = b1.frequency || 0

                        if (a > b) {
                            return -1
                        } else if (a < b) {
                            return 1
                        }

                        return 0
                    })

                    filterData(queries, _queries)

                    return _queries
                })
                break;
            case FilterEnum.Frequency19:
                setQueries((queries) => {
                    const _queries: ISearchingQuery[] = structuredClone(queries)
                    _queries.sort((a1, b1) => {
                        const a = a1.frequency || 0
                        const b = b1.frequency || 0

                        if (a < b) {
                            return -1
                        } else if (a > b) {
                            return 1
                        }

                        return 0
                    })

                    filterData(queries, _queries)

                    return _queries
                })
                break;
            case FilterEnum.PurposeLink:
                break;
            case FilterEnum.RelevantLink:
                break;
            case FilterEnum.PurposeRelevant:
                break;
            case FilterEnum.RelevantPurpose:
                break;
            case FilterEnum.PositionChange:
                break;
            case FilterEnum.Default:
                setQueries((queries) => {
                    const _queries: ISearchingQuery[] = structuredClone(queries)
                    _queries.sort((a1, b1) => {
                        const a = a1.id || 0
                        const b = b1.id || 0

                        if (a < b) {
                            return -1
                        } else if (a > b) {
                            return 1
                        }

                        return 0
                    })

                    filterData(queries, _queries)

                    return _queries
                })
                break;
        }
    }

    const filterData = (prev: ISearchingQuery[], queries: ISearchingQuery[]) => {
        const map: {[idx: number]: number} = {}

        for (let i = 0; i < prev.length; i++)
            map[i] = queries.findIndex(q => q.id === prev[i].id)

        const _data: typeof data = {}

        const keys = Object.keys(data)

        for(const key of keys) {
            const column = structuredClone(data[key])

            for (let i = 0; i < column.length; i++) {
                column[map[i]] = data[key][i]
            }

            _data[key] = column

        }
        setData(_data)
    }

    const calcTops = (_data: typeof data) => {
        const tops: typeof topsData = {}

        const keys = Object.keys(_data).reverse()

        let prev = null

        for (const date of keys) {
            const dateData = _data[date]
            const length = dateData.length

            const top3 = dateData.filter(el => el.pos && el.pos <= 3).length / length
            const top5 = dateData.filter(el => el.pos && el.pos <= 5).length / length
            const top10 = dateData.filter(el => el.pos && el.pos <= 10).length / length
            const top20 = dateData.filter(el => el.pos && el.pos <= 20).length / length
            const top50 = dateData.filter(el => el.pos && el.pos <= 50).length / length
            const top100 = dateData.filter(el => el.pos && el.pos <= 100).length / length

            tops[date] = {
                3: {
                    val: top3 * 100,
                    diff: prev
                        ? top3
                            ? top3 * 100 - prev[3].val
                            : prev[3].val
                                    ? Number.NEGATIVE_INFINITY
                                    : 0
                        : top3 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
                5: {
                    val: top5 * 100,
                    diff: prev
                        ? top5
                            ? top5 * 100 - prev[5].val
                            : prev[5].val
                                ? Number.NEGATIVE_INFINITY
                                : 0
                        : top5 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
                10: {
                    val: top10 * 100,
                    diff: prev
                        ? top10
                            ? top10 * 100 - prev[10].val
                            : prev[10].val
                                ? Number.NEGATIVE_INFINITY
                                : 0
                        : top10 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
                20: {
                    val: top20 * 100,
                    diff: prev
                        ? top20
                            ? top20 * 100 - prev[20].val
                            : prev[20].val
                                ? Number.NEGATIVE_INFINITY
                                : 0
                        : top20 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
                50: {
                    val: top50 * 100,
                    diff: prev
                        ? top50
                            ? top50 * 100 - prev[50].val
                            : prev[50].val
                                ? Number.NEGATIVE_INFINITY
                                : 0
                        : top50 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
                100: {
                    val: top100 * 100,
                    diff: prev
                        ? top100
                            ? top100 * 100 - prev[100].val
                            : prev[100].val
                                ? Number.NEGATIVE_INFINITY
                                : 0
                        : top100 && prev !== null
                            ? Number.POSITIVE_INFINITY
                            : 0
                },
            }

            prev = tops[date]
        }

        const reverse = (_data: typeof tops) => {
            const ndata: typeof tops = {}

            const keys = Object.keys(_data)
                .reverse()

            for(const key of keys)
                ndata[key] = _data[key]

            return ndata
        }
        setTopsData(reverse(tops))
    }

    const maxDay = (monthN: number) => (monthN === 3 || monthN === 5 || monthN === 8 || monthN === 10)
        ? 30
        : monthN === 1
            ? 28
            : 31

    const fetchQueriesMore = async () => {
        if(fetchingData || !filterGroup)
            return

        if(page + 1 >= Math.ceil(queriesCount / 25))
            return

        setFetchingData(true)

        if('groupId' in filterGroup) {
            const res = await Api.GetQueries(projectId, filterGroup.groupId, filterGroup.id, page + 1)

            if ('message' in res)
                return //alert(queries.message)

            setQueries([...queries, ...res])

            await fetchData([...queries, ...res])
        }
        else {
            const res = await Api.GetQueries(projectId, filterGroup.id, 0, page + 1)

            if ('message' in res)
                return //alert(queries.message)


            setQueries([...queries, ...res])

            await fetchData([...queries, ...res])
        }
        setPage(page + 1)

        setFetchingData(false)
    }

    useEffect(() => {
        document.onclick = (e) => {
            // @ts-ignore
            const closest = e.target!.closest('.select-options') || e.target!.closest('.input-container') || e.target!.closest('.icon') || e.target!.closest('.week') || e.target!.closest('.change-marker-popup')

            if(!closest && editingMarkerGroup){
                setEditingMarkerGroup(null)
            }
            if (!closest) {
                const container = document.querySelector('.select-container .input-container.focus')!
                if (!container) {
                    const svg = document.querySelector('.select-container.filter .active')!
                    const tools = document.querySelector('.tools')!

                    if(!svg) return

                    const options = document.querySelector('.select-container.filter .active ~ .select-options')!

                    svg.classList.remove('active')
                    tools.classList.remove('active')
                    options.classList.remove('show')
                }
                else {
                    const options = document.querySelector('.select-container .input-container.focus ~ .select-options')!

                    container.classList.remove('focus')

                    options.classList.remove('show')
                }
            }
        }
    }, [])

    useEffect(() => {
        fetchQueries()
        setPage(0)
        filterGroup?.id === 0 ?
            setQueriesCount(project.queriesCount)
            : setQueriesCount(filterGroup?.queriesCount || 0)
    }, [filterGroup, filterCity])

    useEffect(() => {
        fetchData(queries)
    }, [filterSearchingEngine])

    useEffect(() => {
        fetchGroups()
        fetchProject()
    }, [])

    useEffect(() => {
        calcTops(data)
    }, [data])

    useEffect(() => {
        if (!filterCity) setFilterCity(cities[0])
        if (!filterSearchingEngine) setFilterSearchingEngine(project.searchEngine.split(',')[0] as 'yandex' | 'google')
        if (!filterGroup) setFilterGroup({
            groupName: "Все группы",
            id: 0,
            marker: "",
            projectId: 0,
            queriesCount: 0,
            subgroups: []
        })
        if (!filterDate) {
            const today = new Date()

            const lastWeek = new Date()

            lastWeek.setDate(today.getDate() - 30)

            setFilterDate({
                from: lastWeek,
                to: today
            })
        }
    }, [cities, filterCity, filterDate, filterGroup, filterSearchingEngine, project])

    const colors = [
        {name: 'green'},
        {name: 'pink'},
        {name: 'light-blue'},
        {name: 'peach'},
        {name: 'violet'},
        {name: 'sand'},
        {name: 'dark-pink'},
        {name: 'brown'},
        {name: 'sea'},
        {name: 'light-green'},
        {name: 'blue'},
        {name: 'orange'},
        {name: 'dark-blue'},
        {name: 'purple'},
        {name: 'red'},
        {name: 'stopped'},
    ]

    return <>
        <Helmet title='Позиции'/>
        <div className='row positions'>
            <div className='column'>
                <Sidebar/>
            </div>
            <div className='column main'>
                <div className='row filters'>
                    <div className='searching-engine select-container'>
                        <label className='searching-engine input-container'>
                            <svg className='icon' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 13C23 18.5228 18.5228 23 13 23M23 13C23 7.47715 18.5228 3 13 3M23 13H3M13 23C7.47715 23 3 18.5228 3 13M13 23C15.5013 20.2616 16.9228 16.708 17 13C16.9228 9.29203 15.5013 5.73835 13 3M13 23C10.4987 20.2616 9.07725 16.708 9 13C9.07725 9.29203 10.4987 5.73835 13 3M3 13C3 7.47715 7.47715 3 13 3" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input readOnly onFocus={(e) => {
                                showSelect(e)
                                focusParent(e)
                            }} data-name='searching-engine' value={filterSearchingEngine} className='searching-engine select'/>
                        </label>

                        <div onClick={(e) => e.stopPropagation()} className='searching-engine select-options'>
                            {
                                project.searchEngine.split(',')
                                    .map(engine => <span
                                        key={'searching-engine-' + engine}
                                        className='searching-engine option'
                                        onClick={(e) => {
                                            e.stopPropagation()

                                            setFilterSearchingEngine(engine as 'yandex' | 'google')

                                            const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                            options.classList.remove('show')

                                            const container = document.querySelector('.select-container .input-container.focus')!

                                            container.classList.remove('focus')
                                        }}
                                    >{engine}</span>)
                            }
                        </div>
                    </div>

                    <div className='cities select-container'>
                        <label className='cities input-container'>
                            <input readOnly onFocus={(e) => {
                                showSelect(e)
                                focusParent(e)
                            }} data-name='cities' value={filterCity} className='cities select'/>
                        </label>
                        <div className='cities select-options'>
                            {
                                cities
                                    .map(city => <span
                                        key={'city-' + city}
                                        className='city option'
                                        onClick={(e) => {
                                            e.stopPropagation()

                                            setFilterCity(city)

                                            const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                            options.classList.remove('show')

                                            const container = document.querySelector('.select-container .input-container.focus')!

                                            container.classList.remove('focus')
                                        }}>{city}</span>)
                            }
                        </div>
                    </div>

                    <div className='groups select-container'>
                        <label className='groups input-container'>
                            <svg className='icon' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 19V7C3 5.89543 3.89543 5 5 5H10.3553C10.6254 5 10.884 5.10926 11.0723 5.30292L13 7.28571H21C22.1046 7.28571 23 8.18114 23 9.28571V19C23 20.1046 22.1046 21 21 21H5C3.89543 21 3 20.1046 3 19Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                            <input data-name='groups' onFocus={(e) => {
                                setGroupSearch('')
                                showSelect(e)
                                focusParent(e)
                            }} value={
                                groupSearch !== null ?
                                    groupSearch
                                    :
                                    filterGroup
                                    && 'groupName' in filterGroup
                                        ? filterGroup.groupName
                                        : filterGroup?.subgroupName
                            } onChange={(e) => {
                                setGroupSearch(e.target.value)
                            }} onBlur={() => setGroupSearch(null)} className='groups select'/>
                        </label>
                        <div className='groups select-options'>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()

                                    setFilterGroup({
                                        groupName: "Все группы",
                                        id: 0,
                                        marker: "",
                                        projectId: 0,
                                        queriesCount: 0,
                                        subgroups: []
                                    })

                                    setGroupSearch(null)
                                    const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                    options.classList.remove('show')

                                    const container = document.querySelector('.select-container .input-container.focus')!

                                    container.classList.remove('focus')
                                }}
                                className='group option'><span>Все группы</span></div>
                            {
                                groups
                                    .map(group => {
                                            if (groupSearch && !searchParts(group.groupName, groupSearch))
                                                return []

                                            const markerAttributes: any = {}

                                            if(editingMarkerGroup && !('groupId' in editingMarkerGroup) && editingMarkerGroup?.id === group.id)
                                                markerAttributes.ref = changeMarkerPopup.reference

                                            return [
                                                <div {...markerAttributes} key={'group-' + group.id}
                                                     className='group option'
                                                     onClick={(e) => {
                                                         e.stopPropagation()

                                                         setFilterGroup(group)
                                                         setGroupSearch(null)

                                                         const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                                         options.classList.remove('show')

                                                         const container = document.querySelector('.select-container .input-container.focus')!

                                                         container.classList.remove('focus')
                                                     }}>

                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setEditingMarkerGroup(group)
                                                        }} className='marker-container'>
                                                        <div className={`marker ${group.marker}`}/>
                                                    </div>

                                                    <span style={{flexGrow: 1}}>{group.groupName}</span>

                                                    <div onClick={(e) => {
                                                        e.stopPropagation()
                                                        setModal('auto-check')
                                                    }} className='auto-check-icon'>
                                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11.5 6.22222V11.5L14.6667 14.6667M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>,
                                                ...group.subgroups.map(
                                                    subgroup => {
                                                        if (groupSearch && !searchParts(subgroup.subgroupName, groupSearch))
                                                            return []

                                                        const markerAttributes: any = {}

                                                        if(editingMarkerGroup && 'groupId' in editingMarkerGroup && editingMarkerGroup?.id === subgroup.id)
                                                            markerAttributes.ref = changeMarkerPopup.reference

                                                        return <div {...markerAttributes} key={'subgroup-' + subgroup.id}
                                                                    className='subgroup option'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()

                                                                        setFilterGroup(subgroup)
                                                                        setGroupSearch(null)

                                                                        const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                                                        options.classList.remove('show')

                                                                        const container = document.querySelector('.select-container .input-container.focus')!

                                                                        container.classList.remove('focus')
                                                                    }}
                                                        >
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setEditingMarkerGroup(subgroup)
                                                                }} className='marker-container'>
                                                                <div className={`marker ${subgroup.marker}`}/>
                                                            </div>
                                                            <span style={{flexGrow: 1}}>{subgroup.subgroupName}</span>
                                                            <div onClick={(e) => {
                                                                e.stopPropagation()
                                                                setModal('auto-check')
                                                            }} className='auto-check-icon'>
                                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11.5 6.22222V11.5L14.6667 14.6667M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    }
                                                )
                                            ]
                                        }
                                    )
                            }
                        </div>
                    </div>

                    <div className='date select-container'>
                        <div onClick={(e) => {
                            showSelect(e as unknown as FocusEvent<HTMLDivElement>)
                            focusParent(e as unknown as FocusEvent<HTMLDivElement>)
                        }} className='date input-container'>
                            <svg className='icon' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.0625 2V6.66667M8.9375 2V6.66667M3 11.3333H22M22 11.3333V20.6667C22 21.9553 20.9367 23 19.625 23H5.375C4.06332 23 3 21.9553 3 20.6667V6.66667C3 5.378 4.06332 4.33333 5.375 4.33333H19.625C20.9367 4.33333 22 5.378 22 6.66667V11.3333Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div className='row'>
                                <input value={filterDate?.from?.toLocaleDateString('ru')} readOnly/>
                                <span>&nbsp;-&nbsp;</span>
                                <input value={filterDate?.to?.toLocaleDateString('ru')} readOnly/>
                            </div>
                        </div>
                        <div className='date select-options'>
                            <div className='header row'>
                                <div className='inputs row'>
                                    <label className='row'>
                                        <input name='date' type='radio' onClick={() => {
                                            const today = new Date()

                                            const last = new Date()

                                            last.setFullYear(today.getFullYear() - 1)

                                            setFilterDate({
                                                from: last,
                                                to: today
                                            })
                                        }}/>
                                        <span>1 год</span>
                                    </label>
                                    <label className='row'>
                                        <input name='date' type='radio' onClick={() => {
                                            const today = new Date()

                                            const last = new Date()

                                            last.setMonth(today.getMonth() - 1, 1)

                                            today.setMonth(last.getMonth(), maxDay(last.getMonth()))

                                            setFilterDate({
                                                from: last,
                                                to: today
                                            })
                                        }}/>
                                        <span>Прошлый месяц</span>
                                    </label>
                                    <label className='row'>
                                        <input name='date' type='radio' onClick={() => {
                                            const today = new Date()

                                            const last = new Date()

                                            last.setDate(1)

                                            setFilterDate({
                                                from: last,
                                                to: today
                                            })
                                        }}/>
                                        <span>Текущий месяц</span>
                                    </label>
                                    <label className='row'>
                                        <input name='date' type='radio' onClick={() => {
                                            const today = new Date()

                                            const last = new Date()

                                            last.setMonth(today.getMonth() - 1)

                                            setFilterDate({
                                                from: last,
                                                to: today
                                            })
                                        }}/>
                                        <span>1 месяц</span>
                                    </label>
                                    <label className='row'>
                                        <input name='date' type='radio'  onClick={() => {
                                            const today = new Date()

                                            const last = new Date()

                                            last.setDate(today.getDate() - 7)

                                            setFilterDate({
                                                from: last,
                                                to: today
                                            })
                                        }}/>
                                        <span>1 неделя</span>
                                    </label>
                                </div>
                                <button onClick={(e) => {
                                    fetchData(queries)
                                    const options = e.currentTarget.closest('.select-options') as HTMLDivElement

                                    options.classList.remove('show')

                                    const container = document.querySelector('.select-container .input-container.focus')!

                                    container.classList.remove('focus')
                                }} className='btn'>
                                    Применить
                                </button>
                            </div>
                            <div className='body row'>
                                <button onClick={() => setDateStep(dateStep-1)} disabled={dateStep <= 0} className='btn nav'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 7L8 11L12 15" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                {
                                    filterDate && [dateStep, dateStep + 1, dateStep + 2].map(i => {
                                        const month = new Date(now)

                                        month.setMonth(now.getMonth() - i, 1)

                                        const prevMonth = new Date(month)

                                        prevMonth.setMonth(month.getMonth() - 1, 1)


                                        const nextMonth = new Date(month)

                                        nextMonth.setMonth(month.getMonth() + 1, 1)

                                        const days: Date[] = []

                                        const weekday = (month.getDay() || 7) - 1

                                        const monthN = month.getMonth()

                                        const monthNPrev = prevMonth.getMonth()

                                        const monthNNext = nextMonth.getMonth()

                                        for(let i = weekday; i > 0; i--){
                                            const date = new Date(prevMonth)

                                            date.setDate(maxDay(monthNPrev) + 1 - i)

                                            days.push(date)
                                        }

                                        for(let i = 0;  i < 35 && i < maxDay(monthN); i++){
                                            const date = new Date(month)

                                            date.setDate(i + 1)

                                            days.push(date)
                                        }

                                        if(days.length !== 35) {
                                            const l = 35 - days.length
                                            for (let j = 0; j < l; j++) {
                                                const date = new Date(nextMonth)

                                                date.setDate(j + 1)

                                                days.push(date)
                                            }
                                        }

                                        const daysJSX = []


                                        const to = new Date(filterDate?.to ?? 0)
                                        const from = new Date(filterDate?.from ?? 0)

                                        to.setHours(0, 0, 0, 0)
                                        from.setHours(0, 0, 0, 0)

                                        for(let i = 0; i < 5; i++) {
                                            const weekJSX = <div key={month.getTime() * Math.random() + 124}
                                                                 className='week row'>{[]}</div>

                                            for (let j = 0; j < 7; j++) {
                                                const day = days[i * 7 + j]

                                                const classList = []

                                                if (day.getMonth() !== monthN)
                                                    classList.push('niw')


                                                if (filterDate && from < day && day < to)
                                                    classList.push('ranged')

                                                day.setHours(0, 0, 0, 0)
                                                if (filterDate && (from.getTime() === day.getTime() || to.getTime() === day.getTime()))
                                                    classList.push('border')


                                                const dayJSX = <span onClick={(e) => {

                                                    if(filterDate && filterDate.to && filterDate.from)
                                                        setFilterDate({
                                                            from: day,
                                                            to: null
                                                        })
                                                    else if(filterDate && filterDate.from)
                                                        if(filterDate.from > day) {
                                                            day.setHours(5, 0, 0, 0)
                                                            setFilterDate({
                                                                from: day,
                                                                to: filterDate.from
                                                            })
                                                        }
                                                        else {
                                                            day.setHours(5, 0, 0, 0)
                                                            setFilterDate({
                                                                from: filterDate.from,
                                                                to: day
                                                            })
                                                        }

                                                }} key={day.getTime() * Math.random()} className={classList.join(' ')}>
                                                        {day.getDate()}
                                                    </span>
                                                weekJSX.props.children.push(dayJSX)
                                            }

                                            daysJSX.push(weekJSX)
                                        }

                                        return <>
                                            <div key={Math.random() * month.getTime()} className='column month'>
                                                <span>{month.toLocaleDateString('ru', {month: 'long'})} {month.getFullYear()}</span>
                                                <div className='column'>
                                                    <div className='day-weeks row'>
                                                        <span>Пн</span>
                                                        <span>Вт</span>
                                                        <span>Ср</span>
                                                        <span>Чт</span>
                                                        <span>Пт</span>
                                                        <span>Сб</span>
                                                        <span>Вс</span>
                                                    </div>
                                                    <div className='days column'>
                                                        {
                                                            daysJSX
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    })
                                }
                                <button onClick={() => setDateStep(dateStep+1)} className='btn nav'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 15L14 11L10 7" stroke="#1975FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row sub-page'>
                    <Routes>
                        <Route path='/percentage' element={
                            <Percentage data={topsData}/>
                        }/>
                        <Route path='/graphics' element={
                            <Graphics searchingEngine={filterSearchingEngine ?? 'yandex'} data={data}/>
                        }/>
                    </Routes>
                </div>
                <Scrollbar
                    thumbXProps={{
                        className: 'thumbX'
                    }}
                    trackXProps={{
                        className: 'trackX'
                    }}
                    thumbYProps={{
                        className: 'thumbY'
                    }}
                    trackYProps={{
                        className: 'trackY'
                    }}
                    noDefaultStyles={true}
                    maximalThumbSize={100}
                    minimalThumbSize={100}
                    onScroll={(e) => {
                        if('scrollHeight' in e){
                            const scrollHeight = e.scrollHeight
                            const clientHeight = e.clientHeight
                            const scrollTop = e.scrollTop

                            const max = scrollHeight - clientHeight - 1

                            if(scrollTop >= max)
                                fetchQueriesMore()
                        }
                    }}
                    style={{width: '100%', minHeight: 600}}>
                    <div className='row table-wrapper'>
                        <div className='row table'>
                            <div className='column table-info'>
                                <div className='row table-header'>
                                    <div className='row heading'>
                                        {
                                            querySearchShow
                                                ?
                                                <div className='search-container'>
                                                    <div className='search-input-container'>
                                                        <span className='search-icon'/>
                                                        <input placeholder='Поиск' className='search-input' type='text'
                                                               onChange={(e) => {
                                                                   setQuerySearch(e.target.value)
                                                               }}
                                                               value={querySearch}
                                                               onBlur={() => setQuerySearchShow(false)}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <span className='text'>
                                                        Запросы <span className='count'>({filterGroup?.id === 0 ? project.queriesCount : filterGroup?.queriesCount})</span>
                                                    </span>
                                                    <div className='row tools'>
                                                        <div className='search'>
                                                            <svg onClick={() => setQuerySearchShow(true)} width="22" height="22" viewBox="0 0 22 22" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M20.8992 19.8001L16.2929 15.1938M18.6992 9.3501C18.6992 13.9064 15.0056 17.6001 10.4492 17.6001C5.89287 17.6001 2.19922 13.9064 2.19922 9.3501C2.19922 4.79375 5.89287 1.1001 10.4492 1.1001C15.0056 1.1001 18.6992 4.79375 18.6992 9.3501Z"
                                                                    stroke="#A5AFBB" strokeWidth="2" strokeLinecap="round"
                                                                    strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                        <div className='filter select-container'>
                                                            <svg className='icon' onClick={(e) => {
                                                                const opened = document.querySelector('.select-options.show')

                                                                opened?.classList.remove('show')

                                                                e.currentTarget.classList.add('active')

                                                                const tools = document.querySelector('.tools')

                                                                tools?.classList.add('active')

                                                                const options = e.currentTarget
                                                                    .closest('.select-container')!
                                                                    .querySelector('.select-options') as Element

                                                                options.classList.add('show')
                                                            }} width="22" height="22" viewBox="0 0 22 22" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.93333 3H21M9.93333 12.0667H14.4667M8.8 16.6L5.4 20L2 16.6M5.4 3V18.8667M9.93333 7.53333H17.7333"
                                                                    stroke="#A5AFBB" strokeWidth="2" strokeLinecap="round"
                                                                    strokeLinejoin="round"/>
                                                            </svg>

                                                            <div className='select-options filter'>
                                                                <span data-type={FilterEnum.NameAZ} onClick={filterClick}
                                                                      className='option'>Имя А-Я</span>
                                                                <span data-type={FilterEnum.NameZA} onClick={filterClick}
                                                                      className='option'>Имя Я-А</span>
                                                                <span data-type={FilterEnum.Frequency91} onClick={filterClick}
                                                                      className='option'>Частота 9-1</span>
                                                                <span data-type={FilterEnum.Frequency19} onClick={filterClick}
                                                                      className='option'>Частота 1-9</span>
                                                                <span data-type={FilterEnum.PurposeLink} onClick={filterClick}
                                                                      className='option'>По целевой ссылке</span>
                                                                <span data-type={FilterEnum.RelevantLink} onClick={filterClick}
                                                                      className='option'>По релевантной странице</span>
                                                                <span data-type={FilterEnum.PurposeRelevant} onClick={filterClick}
                                                                      className='option'>Целевая - Релевантная</span>
                                                                <span data-type={FilterEnum.RelevantPurpose} onClick={filterClick}
                                                                      className='option'>Релевантная - Целевая</span>
                                                                <span data-type={FilterEnum.PositionChange} onClick={filterClick}
                                                                      className='option'>Изменение позиции за период</span>
                                                                <span data-type={FilterEnum.Default} onClick={filterClick}
                                                                      className='option'>По умолчанию</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                        }

                                    </div>
                                    <div className='row frequency'>
                                        <span className='text'>Частота</span>
                                    </div>
                                </div>
                                <div className='column table-body'>
                                    {
                                        queries.map(query => {
                                            if(querySearch && !searchParts(query.queryText, querySearch))
                                                return <></>

                                            return <div key={query.queryText + query.id} className='row'>
                                                <div className='query-text'>
                                                    {query.queryText}
                                                </div>
                                                <div className='frequency'>
                                                    {query.frequency}
                                                </div>
                                            </div>
                                        })

                                    }
                                </div>
                            </div>
                            <div className='column table-data'>
                                <div className='row table-header'>
                                    {
                                        times.map(() =>
                                        Object.keys(data).map(date =>
                                            <div key={date} className='column'>
                                                <div className='date'>{date}</div>
                                            </div>
                                        )
                                        )
                                    }
                                </div>
                                <div className='row table-body'>
                                    {
                                        times.map(() =>
                                        Object.keys(data).map(
                                            date => {
                                                const col = data[date]
                                                return <div key={date + Math.random() + '-column'} className='column'>
                                                    {
                                                        col.map((pos, idx) => {
                                                                if(querySearch && !searchParts(queries[idx].queryText, querySearch))
                                                                    return <></>
                                                                return <div
                                                                    key={date + Math.random() + '-cell-id' + pos.id + '-pos-' + pos.pos + '-diff-' + pos.diff}
                                                                    className={`cell row ${getColor(pos.pos)} ${pos.diff >= 0 ? 'positive' : 'negative'}`}>
                                                                    <span className='position'>{pos.pos || '-'}</span>
                                                                    <span className='difference'>
                                                                    {
                                                                        pos.diff === 0
                                                                            ? ''
                                                                            : pos.diff.toLocaleString('ru', {
                                                                                signDisplay: 'always',
                                                                            })
                                                                    }
                                                                        {
                                                                            pos.chd ? '!' : ''
                                                                        }
                                                                </span>
                                                                </div>
                                                            }
                                                        )
                                                    }
                                                </div>
                                            }
                                        )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div>

        </div>
        { editingMarkerGroup !== null &&
          <>
            <div
              className = 'positions-popup change-marker-popup'
              ref={changeMarkerPopup.floating}
              style={{
                  position: changeMarkerPopup.strategy,
                  top: changeMarkerPopup.y ?? 0,
                  left: changeMarkerPopup.x ?? 0,
              }}>

              <span className='heading'>Сменить цвет маркера</span>
              <div className='colors'>
                  {
                      colors.map(color =>
                          <div key={color.name + 'change-marker'}
                               onClick={() => {
                                   const _ = structuredClone(editingMarkerGroup)

                                   _.marker = color.name

                                   setEditingMarkerGroup(_)
                               }}
                               className={`color ${color.name} ${editingMarkerGroup.marker === color.name ? 'picked' : ''}`}/>
                      )
                  }
              </div>

              <div className='buttons'>
                <span className='cancel' onClick={() => setEditingMarkerGroup(null)}>
                    Отменить
                </span>
                <button className='save button'  onClick={() => {
                    const _ = structuredClone(groups)

                    if(!('groupId' in editingMarkerGroup))
                    {
                        const idx = groups.findIndex(g => g.id === editingMarkerGroup.id)

                        _[idx].marker = editingMarkerGroup.marker
                    }
                    else
                    {
                        const gidx = groups.findIndex(g => g.id === editingMarkerGroup.groupId)
                        const idx = _[gidx].subgroups.findIndex((sg: { id: any; }) => sg.id === editingMarkerGroup.id)

                        _[gidx].subgroups[idx].marker = editingMarkerGroup.marker
                    }

                    setGroups(_)
                    setEditingMarkerGroup(null)
                }}>
                  Применить
                </button>
              </div>
            </div>
          </>
        }
        {
            modal === 'auto-check' &&
          <>
            <div className='modal auto-check'>
              <div className='head row'>
                <span>Автопроверка по расписанию</span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body column'>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    setModal(null)
                }} className='column' name='authForm'>
                  <div className='invite-checkboxes column'>
                    <label className='row activate'>
                      <input type='checkbox'/>
                      <span className='row'>
                        Активировать проверку по расписанию для выбраной группы
                      </span>
                    </label>
                  </div>

                  <div className='days column'>
                    <span className='sub-head'>Дни запуска проверок</span>
                    <div className='days-list row'>
                      <div
                        data-name='Monday'
                        onClick={toggleDay}
                        className={`day ${days.has('Monday') ? 'selected' : ''}`}>Пн</div>
                      <div
                        data-name='Tuesday'
                        onClick={toggleDay}
                        className={`day ${days.has('Tuesday') ? 'selected' : ''}`}>Вт</div>
                      <div
                        data-name='Wednesday'
                        onClick={toggleDay}
                        className={`day ${days.has('Wednesday') ? 'selected' : ''}`}>Ср</div>
                      <div
                        data-name='Thursday'
                        onClick={toggleDay}
                        className={`day ${days.has('Thursday') ? 'selected' : ''}`}>Чт</div>
                      <div
                        data-name='Friday'
                        onClick={toggleDay}
                        className={`day ${days.has('Friday') ? 'selected' : ''}`}>Пт</div>
                      <div
                        data-name='Saturday'
                        onClick={toggleDay}
                        className={`day ${days.has('Saturday') ? 'selected' : ''}`}>Сб</div>
                      <div
                        data-name='Sunday'
                        onClick={toggleDay}
                        className={`day ${days.has('Sunday') ? 'selected' : ''}`}>Вс</div>

                    </div>
                  </div>

                  <div className='apply invite-checkboxes column'>
                    <span className='sub-head'>Применять к</span>

                    <label className='row'>
                      <input type='checkbox'/>
                      <span className='row'>
                        Всем группам текущего уровня
                      </span>
                    </label>
                    <label className='row'>
                      <input type='checkbox'/>
                      <span className='row'>
                        Всем подгруппам
                      </span>
                    </label>
                  </div>
                  <div className='row' style={{gap: 20}}>
                    <button style={{width: 180}} type='submit'>Применить</button>
                    <button onClick={() => setModal(null)} className='cancel' style={{width: 180}} type='button'>Отмена</button>
                  </div>
                </form>
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
    </>
}

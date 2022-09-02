import React, {ChangeEvent, useEffect, useRef, useState} from "react"
import Sidebar from "./Sidebar";
import '../resources/styles/queries.css'
import {arrow, flip, offset, shift, useFloating} from '@floating-ui/react-dom';

export default function Queries () {
    const [groups, setGroups] = useState([
        {
            id: 0,
            name: 'СЧ запросы',
            queriesCount: 8,
            marker: 'green',
            subgroups: [{
                groupId: 0,
                id: 0,
                name: 'Подгруппа',
                queriesCount: 3,
                marker: 'green'
            }]
        },
        {
            id: 1,
            name: 'НЧ запросы',
            queriesCount: 15,
            marker: 'stopped',
            subgroups: []
        },
        {
            id: 2,
            name: 'Новая группа',
            queriesCount: 15,
            marker: 'pink',
            subgroups: [{
                groupId: 2,
                id: 1,
                name: 'Подгруппа',
                queriesCount: 0,
                marker: 'pink'
            }]
        }
    ])

    const [selectedGroup, setSelectedGroup] = useState<any | null>({
        id: 0,
        name: 'СЧ запросы',
        queriesCount: 8,
        marker: 'green',
        subgroups: [{
            groupId: 0,
            id: 0,
            name: 'Подгруппа',
            queriesCount: 3,
            marker: 'green'
        }]
    },)

    const [queries, setQueries] = useState<any[]>([
        {
            id: 0,
            groupId: 0,
            text: 'стол для рукоделия'
        },
        {
            id: 1,
            groupId: 0,
            text: 'стол письменный'
        },
        {
            id: 2,
            groupId: 0,
            text: 'удобный стол'
        },
        {
            id: 3,
            groupId: 0,
            text: 'купить письменный стол'
        },
        {
            id: 4,
            groupId: 0,
            text: 'стол для рукоделия'
        },
        {
            id: 5,
            groupId: 0,
            text: 'письменно компьютерный стол'
        },
        {
            id: 6,
            groupId: 0,
            text: 'столы для персонала'
        },
        {
            id: 7,
            groupId: 0,
            text: 'купить письменный стол'
        },
    ])

    const [editingGroup, setEditingGroup] = useState<any|null>(null)
    const [editingSubgroup, setEditingSubgroup] = useState<any|null>(null)
    const [deleteGroupIdPopup, setDeleteGroupIdPopup] = useState<number | null>(null)
    const [deleteSubgroupIdPopup, setDeleteSubgroupIdPopup] = useState<number | null>(null)
    const [groupSearch, setGroupSearch] = useState<string | null>(null)
    const [querySearch, setQuerySearch] = useState<string | null>(null)
    const [editingMarkerGroup, setEditingMarkerGroup] = useState<any | null>( null)
    const [temporaryFilter, setTemporaryFilter] = useState<Set<string> | null>(null)
    const [completeFilter, setCompleteFilter] = useState<Set<string> | null>(null)
    const [selectedQueries, setSelectedQueries] = useState<Set<number>>(new Set<number>())
    const [addingQueries, setAddingQueries] = useState<string | null>(null)
    const [showHelpPopup, setShowHelpPopup] = useState<boolean>(false)

    const deletePopup = useFloating({
        placement: 'right',
        middleware: [offset({
            mainAxis: 44,
            crossAxis: 113,
        }),
            flip(),
            shift(),
        ],
    })

    const changeMarkerPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 0,
            crossAxis: 139,
        }),
            flip(),
            shift(),
        ],
    })

    const filterPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 0,
            crossAxis: 70,
        }),
            flip(),
            shift(),
        ],
    })

    const addQueriesPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 11,
            crossAxis: -160,
        }),
            flip(),
            shift(),
        ],
    })


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

    const onEditingGroupName = (e: ChangeEvent<HTMLInputElement>) => {

        if(!editingGroup)
            return

        const group = structuredClone(editingGroup)

        group.name = e.target.value

        setEditingGroup(group)
    }

    const addEditingGroup = () => {
        const random = Math.round(Math.random() * 1000000)

        const newGroup = {
            id: random,
            name: '',
            queriesCount: 0,
            marker: 'green',
            subgroups: []
        }

        setEditingGroup(newGroup)
    }

    const addGroup = () => {
        const name: string = editingGroup.name

        if(name.trim())
            setGroups([editingGroup, ...groups])

        setEditingGroup(null)
    }

    const onEditingSubgroupName = (e: ChangeEvent<HTMLInputElement>) => {

        if(!editingSubgroup)
            return

        const subgroup = structuredClone(editingSubgroup)

        subgroup.name = e.target.value

        setEditingSubgroup(subgroup)
    }

    const addEditingSubgroup = (groupId: number) => {
        const random = Math.round(Math.random() * 1000000)

        const newSubgroup = {
            groupId: groupId,
            id: random,
            name: '',
            queriesCount: 0,
            marker: 'light-blue'
        }

        setEditingSubgroup(newSubgroup)
    }

    const addSubgroup = (groupId: number) => {
        const name: string = editingSubgroup.name

        if(name.trim()) {
            const tmp: any[] = structuredClone(groups)

            const group = tmp.find(group => group.id === groupId)

            group.subgroups = [editingSubgroup, ...group.subgroups]

            setGroups(tmp)
        }
        setEditingSubgroup(null)
    }

    const toggleDeleteSubgroupPopup = (groupId: number, subgroupId: number) => {
        if(deleteGroupIdPopup === groupId && deleteSubgroupIdPopup === subgroupId)
        {
            setDeleteGroupIdPopup(null)
            setDeleteSubgroupIdPopup(null)
        }
        else {
            setDeleteGroupIdPopup(groupId)
            setDeleteSubgroupIdPopup(subgroupId)
        }
    }

    const deleteSubgroup = (groupId: number, id: number) => {
        const tmp: any[] = structuredClone(groups)

        const group = tmp.find(group => group.id === groupId)

        if(editingMarkerGroup && 'groupId' in editingMarkerGroup && editingMarkerGroup.id === id)
            setEditingMarkerGroup(null)

        group.subgroups = group.subgroups.filter((subgroup: { id: number; }) => subgroup.id !== id)

        setGroups(tmp)
    }

    const toggleDeleteGroupPopup = (id: number) => {
        if(deleteGroupIdPopup === id && deleteSubgroupIdPopup === null)
            setDeleteGroupIdPopup(null)
        else
            setDeleteGroupIdPopup(id)

        setDeleteSubgroupIdPopup(null)
    }

    const deleteGroup = (id: number) => {
        if(editingMarkerGroup && !('groupId' in editingMarkerGroup) && editingMarkerGroup.id === id)
            setEditingMarkerGroup(null)

        setGroups(groups.filter(group => group.id !== id))
    }

    const onGroupSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setGroupSearch(value)
    }

    const onQuerySearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setQuerySearch(value)
    }

    const toggleGroupSearch = () => setGroupSearch(groupSearch === null ? '' : null)

    const toggleQuerySearch = () => setQuerySearch(querySearch === null ? '' : null)

    const searchParts = (str: string, searching: string) => {
        const parts = searching
            .toLowerCase()
            .split(' ')

        str = str.toLowerCase()

        for(const part of parts) {
            const pretty = part.trim()

            if(pretty.length && str.search(pretty) !== -1)
                return true
        }

        return false
    }

    const toggleAllQueries = () => {
        if(isAllQueriesSelected())
            return setSelectedQueries(new Set<number>())

        const selected = new Set<number>()

        for(const query of queries)
        {
            if(querySearch && searchParts(query.text, querySearch))
                selected.add(query.id)
            else if(!querySearch)
                selected.add(query.id)
        }

        setSelectedQueries(selected)
    }

    const toggleQuerySelected = (id: number) => {
        const _: Set<number> = structuredClone(selectedQueries)

        if(_.has(id)) _.delete(id)
        else _.add(id)

        setSelectedQueries(_)
    }

    const isAllQueriesSelected = () => {
        for(const query of queries)
        {
            if(!selectedQueries.has(query.id))
                return false
        }

        return true
    }

    const deleteSelectedQueries = () => {
        const $queries = []

        for(const query of queries){
            if(!selectedQueries.has(query.id))
                $queries.push(query)
        }

        setQueries($queries)
        setSelectedQueries(new Set<number>())
    }

    const addQueries = () => {
        if(!addingQueries) return

        const random = Math.round(Math.random() * 1000000)

        const additionalQueries = addingQueries
            .replaceAll('\r', '')
            .split('\n')
            .filter(query => !!query.trim())
            .map(text => ({id: random, text: text}))

        setQueries([...queries, ...additionalQueries])
    }

    const loadXLSX = () => {
        const input = document.createElement('input') as HTMLInputElement

        input.onchange = (e) => input.remove()

        input.type = 'file'
        input.accept = '.xlsx'

        input.click()

    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(editingMarkerGroup){
                if(!(e.target as Element).classList.contains('marker')
                    && !(e.target as Element).closest('.change-marker-popup')){
                    setEditingMarkerGroup(null)
                }
            }
            else if(deleteGroupIdPopup !== null){
                if(!(e.target as Element).closest('.delete')
                    && !(e.target as Element).closest('.delete-popup')){
                    setDeleteGroupIdPopup(null)
                    setDeleteSubgroupIdPopup(null)
                }
            }
            else if(temporaryFilter){
                if(!(e.target as Element).classList.contains('filter')
                    && !(e.target as Element).closest('.filter-popup')){
                    setTemporaryFilter(null)
                }
            }
            else if(addingQueries !== null){
                if(!(e.target as Element).classList.contains('add-queries')
                    && !(e.target as Element).closest('.add-queries-popup')){
                    setAddingQueries(null)
                }
            }

        })
    })

    useEffect(() => {
        const elem = document.querySelector(`.group.editing .name`) as HTMLInputElement

        if(elem && document.activeElement != elem)
            elem.focus()

    }, [editingGroup])

    useEffect(() => {
        const elem = document.querySelector(`.subgroup.editing .name`) as HTMLInputElement

        if(elem && document.activeElement != elem)
            elem.focus()

    }, [editingSubgroup])

    return <>
        <div className='page-row'>
            <div className='page'>
                <div className='page-column'>
                    <Sidebar/>
                </div>

                <div className='groups page-column'>
                    <div className='header'>
                        <span className='heading'>Группы</span>
                        <div className='right'>
                            <div className={`search ${groupSearch !== null ? 'active' : ''}`} onClick={toggleGroupSearch}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9002 19.8001L16.2939 15.1938M18.7002 9.3501C18.7002 13.9064 15.0065 17.6001 10.4502 17.6001C5.89385 17.6001 2.2002 13.9064 2.2002 9.3501C2.2002 4.79375 5.89385 1.1001 10.4502 1.1001C15.0065 1.1001 18.7002 4.79375 18.7002 9.3501Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>

                            <div ref={filterPopup.reference} className={`filter ${temporaryFilter ? 'active' : ''}`} onClick={() => {
                                if(temporaryFilter)
                                    return setTemporaryFilter(null)

                                if(completeFilter)
                                    setTemporaryFilter(structuredClone(completeFilter))
                                else
                                    setTemporaryFilter(new Set<string>())
                            }}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.2002 2.19995L7.7002 11V17.6L14.3002 20.9V11L19.8002 2.19995H2.2002Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>

                            <button className='button add-group' onClick={addEditingGroup}>
                                Добавить
                            </button>
                        </div>
                    </div>
                    {
                        groupSearch !== null ?
                            <div className='search-container'>
                                <div className='search-input-container'>
                                    <span className='search-icon'/>
                                    <input placeholder='Поиск' className='search-input' type='text' onChange={onGroupSearchInput} value={groupSearch}/>
                                </div>
                            </div>
                            : <></>
                    }
                    <div className='groups-list'>
                        {
                            editingGroup &&
                          <div className='group editing'>
                            <div className='left'>
                              <div className={`marker light-blue`}/>
                              <form onSubmit={addGroup}>
                                <input
                                  onChange={onEditingGroupName}
                                  onBlur={addGroup}
                                  value={editingGroup.name}
                                  type='text'
                                  className='name' />
                              </form>
                            </div>
                          </div>
                        }
                        {
                            groups.map(group => {
                                if(groupSearch && !searchParts(group.name, groupSearch))
                                    return <></>
                                if(completeFilter && completeFilter.size !== 0 && !completeFilter.has(group.marker))
                                    return <></>

                                const deleteAttributes: any = {}
                                const markerAttributes: any = {}

                                if(deleteGroupIdPopup === group.id)
                                    deleteAttributes.ref = deletePopup.reference
                                if(editingMarkerGroup && !('groupId' in editingMarkerGroup) && editingMarkerGroup?.id === group.id)
                                    markerAttributes.ref = changeMarkerPopup.reference

                                const groupSelected = selectedGroup
                                    && !('groupId' in selectedGroup)
                                    && selectedGroup.id === group.id

                                const groupJSX = <div key={'group' + group.name + group.id} className={`group ${groupSelected ? 'selected' : ''}`}>
                                    <div className='left' onClick={() => setSelectedGroup(group)}>
                                        <div onClick={() => setEditingMarkerGroup(group)} {...markerAttributes} className={`marker ${group.marker}`}/>
                                        <span className='name'>{group.name}</span>
                                    </div>

                                    <div className='right'>
                                        <div onClick={() => addEditingSubgroup(group.id)} className='add-subgroup'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 6.22222V17.8333C21 19.5822 19.5822 21 17.8333 21H6.22222M9.38889 9.38889V6.22222M9.38889 9.38889V12.5556M9.38889 9.38889H12.5556M9.38889 9.38889H6.22222M5.16667 16.7778H13.6111C15.36 16.7778 16.7778 15.36 16.7778 13.6111V5.16667C16.7778 3.41777 15.36 2 13.6111 2H5.16667C3.41777 2 2 3.41777 2 5.16667V13.6111C2 15.36 3.41777 16.7778 5.16667 16.7778Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div className='clock'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.5 6.22222V11.5L14.6667 14.6667M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div
                                            {...deleteAttributes}
                                            onClick={() => toggleDeleteGroupPopup(group.id)} className='delete'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M17.6002 4.4001V17.6001C17.6002 18.8151 16.6152 19.8001 15.4002 19.8001H6.6002C5.38517 19.8001 4.4002 18.8151 4.4002 17.6001V4.4001M14.3002 4.4001V3.3001C14.3002 2.08507 13.3152 1.1001 12.1002 1.1001H9.9002C8.68517 1.1001 7.7002 2.08507 7.7002 3.3001V4.4001M2.2002 4.4001H19.8002M8.8002 8.8001V15.4001M13.2002 8.8001V15.4001"
                                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                            </svg>
                                        </div>

                                        <span className='queries-count'>({group.queriesCount})</span>
                                    </div>
                                </div>
                                const subgroupEditing = editingSubgroup?.groupId === group.id
                                    ? <div className='subgroup editing'>
                                        <div className='left'>
                                            <div className={`marker ${editingSubgroup.marker}`}/>
                                            <form onSubmit={() => addSubgroup(group.id)}>
                                                <input
                                                    onChange={onEditingSubgroupName}
                                                    onBlur={() => addSubgroup(group.id)}
                                                    value={editingSubgroup.name}
                                                    type='text'
                                                    className='name'/>
                                            </form>
                                        </div>
                                    </div>
                                    : null

                                const subgroupsJSX = group.subgroups.map(subgroup => {
                                    const deleteAttributes: any = {}
                                    const markerAttributes: any = {}

                                    if(deleteSubgroupIdPopup === subgroup.id)
                                        deleteAttributes.ref = deletePopup.reference
                                    if(editingMarkerGroup && 'groupId' in editingMarkerGroup && editingMarkerGroup?.id === subgroup.id) {
                                        markerAttributes.ref = changeMarkerPopup.reference
                                    }

                                    const subgroupSelected = selectedGroup
                                        && 'groupId' in selectedGroup
                                        && selectedGroup.id === subgroup.id

                                    return <div key={'subgroup' + subgroup.name + subgroup.id} className={`subgroup ${subgroupSelected ? 'selected' : ''}`}>
                                        <div className='left' onClick={() => setSelectedGroup(subgroup)}>
                                            <div  onClick={() => setEditingMarkerGroup(subgroup)}  {...markerAttributes} className={`marker ${subgroup.marker}`}/>
                                            <span className='name'>{subgroup.name}</span>
                                        </div>

                                        <div className='right'>
                                            <div className='clock'>
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.5 6.22222V11.5L14.6667 14.6667M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <div
                                                {...deleteAttributes}
                                                onClick={() => toggleDeleteSubgroupPopup(group.id, subgroup.id)}
                                                 className='delete'>
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M17.6002 4.4001V17.6001C17.6002 18.8151 16.6152 19.8001 15.4002 19.8001H6.6002C5.38517 19.8001 4.4002 18.8151 4.4002 17.6001V4.4001M14.3002 4.4001V3.3001C14.3002 2.08507 13.3152 1.1001 12.1002 1.1001H9.9002C8.68517 1.1001 7.7002 2.08507 7.7002 3.3001V4.4001M2.2002 4.4001H19.8002M8.8002 8.8001V15.4001M13.2002 8.8001V15.4001"
                                                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <span className='queries-count'>({subgroup.queriesCount})</span>
                                        </div>
                                    </div>
                                })

                                return editingSubgroup?.groupId === group.id ? [groupJSX, subgroupEditing, ...subgroupsJSX]
                                    : [groupJSX, ...subgroupsJSX]
                            })
                        }
                    </div>

                </div>
                <div className='queries page-column'>
                    <div className='header'>
                        <div className='left'>
                            <input onChange={toggleAllQueries} checked={selectedQueries.size !== 0 && isAllQueriesSelected()} id='check_all' className='check-all checkbox' type='checkbox'/>
                            <label htmlFor='check_all'/>
                            <span className='heading'>Запросы</span>
                        </div>
                        <div className='right'>
                            {
                                selectedQueries.size !== 0 &&
                                <div onClick={deleteSelectedQueries} className='delete-queries'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.6002 4.39998V17.6C17.6002 18.815 16.6152 19.8 15.4002 19.8H6.6002C5.38517 19.8 4.4002 18.815 4.4002 17.6V4.39998M14.3002 4.39998V3.29998C14.3002 2.08495 13.3152 1.09998 12.1002 1.09998H9.9002C8.68517 1.09998 7.7002 2.08495 7.7002 3.29998V4.39998M2.2002 4.39998H19.8002M8.8002 8.79998V15.4M13.2002 8.79998V15.4"
                                            stroke="#FE5555" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            }
                            <div className={`search ${querySearch !== null ? 'active' : ''}`} onClick={toggleQuerySearch}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9002 19.8001L16.2939 15.1938M18.7002 9.3501C18.7002 13.9064 15.0065 17.6001 10.4502 17.6001C5.89385 17.6001 2.2002 13.9064 2.2002 9.3501C2.2002 4.79375 5.89385 1.1001 10.4502 1.1001C15.0065 1.1001 18.7002 4.79375 18.7002 9.3501Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>

                            <div onClick={() => setShowHelpPopup(true)} className='help'>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.0001 16.4891V16.5001M11.0001 13.2001C11.0001 11.0001 14.3001 11.0001 14.3001 8.7001C14.3001 6.93279 12.8518 5.5001 11.0001 5.5001C9.43782 5.5001 8.0723 6.51992 7.7001 7.9001M20.9001 11.0001C20.9001 16.4677 16.4677 20.9001 11.0001 20.9001C5.53248 20.9001 1.1001 16.4677 1.1001 11.0001C1.1001 5.53248 5.53248 1.1001 11.0001 1.1001C16.4677 1.1001 20.9001 5.53248 20.9001 11.0001Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>

                            <div onClick={loadXLSX} className='import-excel'>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.6498 1.1001L18.6998 7.2876M12.6498 1.1001V6.1876C12.6498 6.79511 13.1423 7.2876 13.7498 7.2876H18.6998M12.6498 1.1001H6.5998C4.77727 1.1001 3.2998 2.57756 3.2998 4.4001V17.6001C3.2998 19.4226 4.77726 20.9001 6.5998 20.9001H10.9998M18.6998 7.2876V10.7938M12.0998 9.9001L10.4498 12.1001M10.4498 12.1001L8.7998 14.3001M10.4498 12.1001L8.7998 9.9001M10.4498 12.1001L12.0998 14.3001M17.0498 14.3001V20.9001M17.0498 20.9001L14.2998 18.1501M17.0498 20.9001L19.7998 18.1501" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>

                            <button ref={addQueriesPopup.reference} className='button add-queries' onClick={() => setAddingQueries('')}>
                                Добавить запрос
                            </button>
                        </div>
                    </div>
                    {
                        querySearch !== null ?
                            <div className='search-container'>
                                <div className='search-input-container'>
                                    <span className='search-icon'/>
                                    <input placeholder='Поиск' className='search-input' type='text' onChange={onQuerySearchInput} value={querySearch}/>
                                </div>
                            </div>
                            : <></>
                    }
                    <div className='queries-list'>
                        {
                            queries.map(query => {

                                if(querySearch && !searchParts(query.text, querySearch))
                                    return <></>

                                return <div key={query.text + query.id} className='query'>
                                    <input onChange={() => toggleQuerySelected(query.id)} checked={selectedQueries.has(query.id)} id={`query_checkbox_id${query.id}`} type='checkbox' className='checkbox'/>
                                    <label htmlFor={`query_checkbox_id${query.id}`}/>
                                    <span className='text'>{query.text}</span>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        { deleteGroupIdPopup !== null &&
          <>
            <div
              className = 'delete-popup'
              ref={deletePopup.floating}
              style={{
                  position: deletePopup.strategy,
                  top: deletePopup.y ?? 0,
                  left: deletePopup.x ?? 0,
              }}>

              <span className='attention'>Внимание!</span>
              <span className='description'>
                Удаление папки приведёт к удалению содержимого папки (вложенные папки, группы, поисковые запросы)
              </span>

              <div className='buttons'>
                <span className='cancel' onClick={() => setDeleteGroupIdPopup(null)}>
                    Отменить
                </span>
                <button className='delete button'  onClick={() => {
                    if(deleteSubgroupIdPopup !== null) {
                        deleteSubgroup(deleteGroupIdPopup, deleteSubgroupIdPopup)
                        setDeleteSubgroupIdPopup(null)
                    }
                    else
                    {
                        deleteGroup(deleteGroupIdPopup)
                    }
                    setDeleteGroupIdPopup(null)
                }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.6002 4.4001V17.6001C17.6002 18.8151 16.6152 19.8001 15.4002 19.8001H6.6002C5.38517 19.8001 4.4002 18.8151 4.4002 17.6001V4.4001M14.3002 4.4001V3.3001C14.3002 2.08507 13.3152 1.1001 12.1002 1.1001H9.9002C8.68517 1.1001 7.7002 2.08507 7.7002 3.3001V4.4001M2.2002 4.4001H19.8002M8.8002 8.8001V15.4001M13.2002 8.8001V15.4001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
          </>
        }
        { editingMarkerGroup !== null &&
          <>
            <div
              className = 'change-marker-popup'
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
                          <div
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
        { temporaryFilter !== null &&
          <>
            <div
              className = 'change-marker-popup filter-popup'
              ref={filterPopup.floating}
              style={{
                  position: filterPopup.strategy,
                  top: filterPopup.y ?? 0,
                  left: filterPopup.x ?? 0,
              }}>

              <span className='heading'>Отобразить группы</span>
              <div className='colors'>
                  {
                      colors.map(color =>
                          <div
                              onClick={() => {
                                  const _: Set<string> = structuredClone(temporaryFilter)

                                  if(_.has(color.name))
                                      _.delete(color.name)
                                  else
                                      _.add(color.name)

                                  setTemporaryFilter(_)
                              }}
                              className={`color ${color.name} ${temporaryFilter.has(color.name) ? 'picked' : ''}`}/>
                      )
                  }
              </div>

              <div className='buttons'>
                <span className='cancel' onClick={() => {
                    setTemporaryFilter(null)
                }}>
                    Отменить
                </span>
                <button className='save button'  onClick={() => {
                    setCompleteFilter(temporaryFilter)
                    setTemporaryFilter(null)
                }}>
                  Показать
                </button>
              </div>
            </div>
          </>
        }
        { addingQueries !== null &&
          <>
            <div
              className = 'change-marker-popup add-queries-popup'
              ref={addQueriesPopup.floating}
              style={{
                  position: addQueriesPopup.strategy,
                  top: addQueriesPopup.y ?? 0,
                  left: addQueriesPopup.x ?? 0,
              }}>
              <textarea className='queries-text' onChange={(e) => {
                setAddingQueries(e.target.value)
              }} value={addingQueries} placeholder='Введите один или несколько запросов'></textarea>

              <div className='buttons'>
                <span className='cancel' onClick={() => {
                    setAddingQueries(null)
                }}>
                    Отменить
                </span>
                <button className='save button'  onClick={() => {
                    addQueries()
                    setAddingQueries(null)
                }}>
                  Добавить
                </button>
              </div>
            </div>
          </>
        }
        {
            showHelpPopup &&
          <div className='help-popup'>
            <div className='header'>
                <span className='heading'>Импорт запросов из Excel</span>
              <span onClick={() => setShowHelpPopup(false)} className='close-popup'>&times;</span>
            </div>
            <span className='text'>
                Чтобы загрузить сразу группы и подгруппы с запросами, подготовьте файл XLSX из 3-х столбцов:
                <ul>
                  <li>столбец — название группы;</li>
                    <li>столбец — запрос;</li>
                    <li>столбец — название подгруппы; (не обязательно)</li>
                </ul>
                При заполнении 3-его столбца напротив запроса, создатся вложенная группа в которую разместится запрос.
                <br/><br/>
                Чтобы загрузить файл, нажмите на кнопку левее от справки.
              </span>
            <div className='download-example-container'>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.7492 0.0273818C11.6172 0.0512887 11.0058 0.158663 9.49988 0.4224C8.67942 0.566085 7.40097 0.790027 6.48039 0.9513C1.6959 1.78949 0.0149802 2.08354 0.00811471 2.08354C0.00355965 2.08354 0 5.55835 0 9.9993C0 14.533 0.00352209 17.9151 0.00823681 17.9151C0.0127731 17.9151 0.208237 17.9487 0.442611 17.9897C0.676985 18.0308 1.24489 18.1303 1.70463 18.2108C2.16436 18.2913 2.82789 18.4075 3.17915 18.4691C3.53041 18.5306 4.10942 18.632 4.46584 18.6944C5.58662 18.8907 6.36397 19.0269 7.22235 19.1773C7.6795 19.2574 8.91148 19.473 9.96008 19.6565C11.0087 19.84 11.8761 19.9923 11.8878 19.995L11.9089 20V18.8073V17.6146H15.5235C19.5191 17.6146 19.2137 17.6193 19.3859 17.5546C19.694 17.4389 19.9208 17.1691 19.9868 16.8399C19.9981 16.7839 20 15.7393 20 9.74578V2.71737L19.9742 2.62347C19.8979 2.34629 19.7241 2.13173 19.4741 2.00612C19.3892 1.96348 19.2763 1.9281 19.1842 1.9153C19.1328 1.90815 18.0419 1.90514 15.51 1.90514H11.9089V0.952051C11.9089 0.427855 11.9057 -0.000572216 11.9019 5.73678e-07C11.898 0.000563973 11.8293 0.012893 11.7492 0.0273818ZM19.0467 9.75986V16.6662H15.4778H11.9089V15.9526V15.2389H12.6227H13.3365V14.5253V13.8116H12.6227H11.9089V13.3328V12.8539H12.6227H13.3365V12.1402V11.4266H12.6227H11.9089V10.9524V10.4782H12.6227H13.3365V9.76455V9.05092H12.6227H11.9089V8.57203V8.09314H12.6227H13.3365V7.3795V6.66586H12.6227H11.9089V6.19167V5.71747H12.6227H13.3365V5.00484C13.3365 4.44294 13.334 4.29143 13.3247 4.28855C13.3183 4.28654 12.9971 4.28527 12.6109 4.28571L11.9089 4.28653V3.57003V2.85352H15.4778H19.0467V9.75986ZM14.2935 4.29078C14.2884 4.29391 14.2859 4.58566 14.2873 5.00442L14.2897 5.71278L15.9545 5.71515L17.6193 5.71753L17.6169 5.00198L17.6145 4.28645L15.9583 4.28597C15.0473 4.28571 14.2982 4.28787 14.2935 4.29078ZM8.49964 5.72451C8.49964 5.72839 8.05596 6.63086 7.51368 7.73003L6.52774 9.7285L7.35525 11.378C7.81038 12.2853 8.27122 13.2023 8.37932 13.4159C8.48743 13.6295 8.57458 13.8054 8.57299 13.8067C8.57139 13.8081 8.24888 13.7889 7.8563 13.7641C7.46372 13.7392 7.05799 13.7139 6.95468 13.7079C6.84112 13.7012 6.76276 13.6926 6.75652 13.6862C6.73911 13.6682 5.65196 11.0888 5.62903 11.0111C5.61722 10.971 5.59398 10.8739 5.57737 10.7951C5.54618 10.6472 5.53529 10.6149 5.53447 10.668C5.53346 10.734 5.42787 11.092 5.36752 11.2341C5.23633 11.5431 4.36866 13.541 4.36338 13.5463C4.35659 13.5531 2.86139 13.466 2.82483 13.4567L2.79924 13.4501L3.74288 11.6013L4.68653 9.75242L3.83255 7.90172C3.36286 6.88385 2.97942 6.05019 2.98046 6.04915C2.98212 6.04748 3.05377 6.04261 3.38108 6.0219C3.43015 6.0188 3.72063 6.00069 4.02659 5.98167L4.58288 5.94707L4.59142 5.97078C4.59611 5.98381 4.79306 6.4952 5.02908 7.10719C5.47499 8.26344 5.51578 8.37312 5.55586 8.52364C5.56913 8.57349 5.59239 8.65087 5.60756 8.6956C5.62272 8.74032 5.63513 8.79068 5.63513 8.8075C5.63513 8.82432 5.63719 8.83601 5.63973 8.83348C5.64225 8.83095 5.66726 8.74679 5.69531 8.64646C5.80421 8.25684 5.81998 8.21648 6.33887 6.9992C6.61405 6.35364 6.84194 5.82266 6.84529 5.81924C6.84863 5.81581 6.96337 5.80631 7.10026 5.7981C7.76199 5.75846 8.00277 5.74375 8.17563 5.7324C8.40297 5.71749 8.49965 5.71513 8.49964 5.72451ZM14.285 7.3795V8.09314H15.9521H17.6192V7.3795V6.66586H15.9521H14.285V7.3795ZM14.2873 9.76221L14.2897 10.4735L15.9544 10.4759L17.6192 10.4783V9.76458V9.05092H15.952H14.2849L14.2873 9.76221ZM14.285 12.1402V12.8539H15.9521H17.6192V12.1402V11.4266H15.9521H14.285V12.1402ZM14.2873 14.5229L14.2897 15.2342L15.9544 15.2366L17.6192 15.239V14.5253V13.8116H15.952H14.2849L14.2873 14.5229Z"
                      fill="#1975FF"/>
              </svg>
              <span className='download-example'>Скачать пример файла Excel</span>
            </div>
          </div>
        }
        {
            showHelpPopup && <div onClick={() => setShowHelpPopup(false)} className='popup-background'/>
        }
    </>
}
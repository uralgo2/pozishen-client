import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import '../resources/styles/projects.css'
import {useNavigate} from "react-router";
import {flip, offset, shift, useFloating} from "@floating-ui/react-dom";
import {IProject} from "../types";
import {Api} from "../api";
import {Helmet} from "react-helmet";

interface IProjectsProps {
    projects: IProject[],
    setProjects: Dispatch<SetStateAction<IProject[]>>
}

export default function Projects ({projects, setProjects}: IProjectsProps) {
    const [temporaryFilter, setTemporaryFilter] = useState<Set<string> | null>(null)
    const [completeFilter, setCompleteFilter] = useState<Set<string> | null>(null)
    const [editingMarkerProject, setEditingMarkerProject] = useState<any | null>( null)
    const [search, setSearch] = useState<string>('')
    const [searchShow, setSearchShow] = useState(false)

    const changeMarkerPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 0,
            crossAxis: 139,
        }),
            
            shift(),
        ],
    })

    const filterPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 0,
            crossAxis: 70,
        }),
            
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

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(editingMarkerProject){
                if(!(e.target as Element).classList.contains('marker')
                    && !(e.target as Element).closest('.change-marker-popup')){
                    setEditingMarkerProject(null)
                }
            }
            else if(temporaryFilter){
                if(!(e.target as Element).closest('.filter')
                    && !(e.target as Element).closest('.filter-popup')){
                    setTemporaryFilter(null)
                }
            }
            else if(searchShow){
                if(!(e.target as Element).classList.contains('name')
                    && !(e.target as Element).closest('.search-container')){
                    setSearchShow(false)
                }
            }

        })
    })

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

    const navigate = useNavigate()

    useEffect(() => {
        const elem = document.querySelector(`.search-input`) as HTMLInputElement

        if(elem && document.activeElement != elem)
            elem.focus()
    }, [searchShow])
    return <>
        <Helmet title='Проекты'/>
        {
            projects.length === 0 ?
                <div className='no-projects'>
                    <span className='heading'>Давайте приступим</span>
                    <span className='text'>У вас ещё нет проектов, добавьте сайт чтоб начать работу</span>

                    <button onClick={()=>navigate('/projects/create')} className='add-site button'>
                        Добавить сайт
                        <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 6H3C1.89543 6 1 6.89543 1 8V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V13.5M16 6H19M19 6H22M19 6V9M19 6V3M13 6V4C13 2.89543 12.1046 2 11 2H9C7.89543 2 7 2.89543 7 4V6H13Z"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <span className='text'>Вы так же можете загрузить десктопную программу для работы на более выгодных условиях</span>

                    <button onClick={() => {
                        const a = document.createElement('a') as HTMLAnchorElement

                        a.target = '_blank'
                        a.href = Api.host + '/api/getClient?c=' + Api.secret
                        a.click()

                        a.remove()
                    }} className='download-program button'>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.9412 3.11765H4.23529C3.00078 3.11765 2 4.11842 2 5.35294V14.2941C2 15.5286 3.00078 16.5294 4.23529 16.5294H17.6471C18.8816 16.5294 19.8824 15.5286 19.8824 14.2941V12.0588M17.0882 2V8.70588M17.0882 8.70588L14.2941 5.91176M17.0882 8.70588L19.8824 5.91176M10.9412 16.5294V21M6.47059 21H15.4118"
                                stroke="#1975FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Скачать программу
                    </button>
                </div>
                :
                <div className='projects-container'>
                    <div className='projects'>
                        <div className='projects-table'>
                            <div className='header'>
                            <div ref={filterPopup.reference} className={`filter ${temporaryFilter ? 'active' : ''}`}
                                 onClick={(e) => {
                                e.stopPropagation()

                                if(temporaryFilter)
                                    return setTemporaryFilter(null)

                                if(completeFilter)
                                    setTemporaryFilter(structuredClone(completeFilter))
                                else
                                    setTemporaryFilter(new Set<string>())
                            }}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.2002 2.19995L7.7002 11V17.6L14.3002 20.9V11L19.8002 2.19995H2.2002Z"
                                          stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                </svg>
                            </div>
                                {
                                    searchShow ?
                                        <div className='search-container'>
                                            <div className='search-input-container'>
                                                <input placeholder='Поиск' className='search-input' type='text' onChange={(e) => setSearch(e.target.value)} value={search}/>
                                                <span className='search-icon'/>
                                            </div>
                                        </div>
                                        :
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            setSearchShow(true)
                                        }} className='name'>
                                            Название
                                            <span className='search-icon'>
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M23.75 23.5L18.5155 18.2655M21.25 11.625C21.25 16.8027 17.0527 21 11.875 21C6.69733 21 2.5 16.8027 2.5 11.625C2.5 6.44733 6.69733 2.25 11.875 2.25C17.0527 2.25 21.25 6.44733 21.25 11.625Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </div>
                                }
                            <div className='collection-date'>
                                дата сбора
                            </div>
                            <div className='queries-count'>
                                запросы
                            </div>
                            <div className='top-10'>
                                топ-10
                            </div>
                            <div className='top-20'>
                                топ-20
                            </div>
                            <div className='top-30'>
                                топ-30
                            </div>
                            <div className='top-50'>
                                топ-50
                            </div>
                            <div className='top-100'>
                                топ-100
                            </div>
                            </div>
                            <div className='projects-body'>
                            {
                                projects.map(project => {
                                    if(completeFilter && completeFilter.size > 0 && !completeFilter.has(project.marker))
                                        return <></>

                                    if(search && !searchParts(project.siteAddress, search))
                                        return <></>
                                    const markerAttributes: any = {}

                                    if(editingMarkerProject && editingMarkerProject.id === project.id)
                                        markerAttributes.ref = changeMarkerPopup.reference

                                    const collectionDate = project.lastCollection?.toLocaleDateString('ru', {
                                        month: '2-digit',
                                        day: '2-digit',
                                    })
                                    const collectionTime = project.lastCollection?.toLocaleTimeString('ru', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })

                                    return <div className='project'>
                                        <div onClick={
                                            (e) => {
                                                e.stopPropagation()

                                                if(editingMarkerProject?.id === project.id)
                                                    return setEditingMarkerProject(null)


                                                setEditingMarkerProject(project)
                                            }
                                        } className='marker-container'>
                                            <div {...markerAttributes} className={`marker ${project.marker}`}/>
                                        </div>

                                        <div className='name'>
                                            <span  onClick={() => navigate('/positions?id=' + project.id)} className='site-name'>{project.siteAddress}</span>
                                            <div className='right'>
                                                <svg onClick={()=>navigate(`/projects/update?id=${project.id}`)} className='settings' width="24" height="24" viewBox="0 0 24 24"
                                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.75099 3.00433C9.75099 2.38331 10.2544 1.87988 10.8754 1.87988H13.1243C13.7453 1.87988 14.2488 2.38331 14.2488 3.00433V3.6439C14.2488 4.12493 14.5716 4.54285 15.0159 4.7273C15.4603 4.91182 15.9778 4.84149 16.3181 4.50122L16.7705 4.04883C17.2096 3.60971 17.9215 3.60971 18.3607 4.04883L19.9509 5.63904C20.39 6.07816 20.39 6.79012 19.9509 7.22924L19.4985 7.68156C19.1582 8.02186 19.0879 8.53937 19.2725 8.98384C19.4569 9.42813 19.8749 9.75099 20.3559 9.75099L20.9954 9.75099C21.6165 9.75099 22.1199 10.2544 22.1199 10.8754V13.1243C22.1199 13.7453 21.6165 14.2488 20.9954 14.2488H20.3559C19.8748 14.2488 19.4569 14.5716 19.2725 15.0159C19.0879 15.4604 19.1583 15.9779 19.4985 16.3181L19.9509 16.7705C20.39 17.2096 20.39 17.9216 19.9509 18.3607L18.3607 19.9509C17.9216 20.39 17.2096 20.39 16.7705 19.9509L16.3181 19.4985C15.9778 19.1583 15.4604 19.0879 15.0159 19.2725C14.5716 19.4569 14.2488 19.8748 14.2488 20.3559V20.9954C14.2488 21.6165 13.7453 22.1199 13.1243 22.1199H10.8754C10.2544 22.1199 9.75099 21.6165 9.75099 20.9954V20.3559C9.75099 19.8749 9.42813 19.4569 8.98383 19.2725C8.53937 19.0879 8.02186 19.1582 7.68156 19.4985L7.22922 19.9509C6.7901 20.39 6.07814 20.39 5.63902 19.9509L4.04881 18.3607C3.60969 17.9216 3.60969 17.2096 4.04881 16.7705L4.50122 16.3181C4.84149 15.9778 4.91182 15.4603 4.7273 15.0159C4.54285 14.5716 4.12493 14.2488 3.6439 14.2488H3.00433C2.38331 14.2488 1.87988 13.7453 1.87988 13.1243V10.8754C1.87988 10.2544 2.38331 9.75099 3.00433 9.75099L3.64387 9.75099C4.12492 9.75099 4.54285 9.42814 4.72731 8.98386C4.91183 8.53941 4.84151 8.02192 4.50122 7.68164L4.04883 7.22925C3.60971 6.79012 3.60971 6.07816 4.04883 5.63904L5.63904 4.04884C6.07816 3.60971 6.79012 3.60971 7.22924 4.04884L7.68163 4.50122C8.02191 4.84151 8.53941 4.91183 8.98386 4.72731C9.42814 4.54285 9.75099 4.12492 9.75099 3.64387V3.00433Z"
                                                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"/>
                                                    <path
                                                        d="M14.2488 11.9999C14.2488 13.2419 13.2419 14.2488 11.9999 14.2488C10.7579 14.2488 9.75099 13.2419 9.75099 11.9999C9.75099 10.7579 10.7579 9.75099 11.9999 9.75099C13.2419 9.75099 14.2488 10.7579 14.2488 11.9999Z"
                                                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"/>
                                                </svg>
                                                <svg className='translate' width="22" height="22" viewBox="0 0 22 22"
                                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M11 7.88108V2M11 2L8.05946 4.94054M11 2L13.9405 4.94054M14.1189 11H20M20 11L17.0595 8.05946M20 11L17.0595 13.9405M7.88108 11H2M2 11L4.94054 13.9405M2 11L4.94054 8.05946M11 14.1189V20M11 20L13.9405 17.0595M11 20L8.05946 17.0595"
                                                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"/>
                                                </svg>
                                                <svg onClick={() => {
                                                    Api.DeleteProject(project.id)
                                                    setProjects(projects.filter(p => p.id !== project.id))
                                                }} className='delete' width="22" height="22" viewBox="0 0 22 22"
                                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M17.6002 4.4001V17.6001C17.6002 18.8151 16.6152 19.8001 15.4002 19.8001H6.6002C5.38517 19.8001 4.4002 18.8151 4.4002 17.6001V4.4001M14.3002 4.4001V3.3001C14.3002 2.08507 13.3152 1.1001 12.1002 1.1001H9.9002C8.68517 1.1001 7.7002 2.08507 7.7002 3.3001V4.4001M2.2002 4.4001H19.8002M8.8002 8.8001V15.4001M13.2002 8.8001V15.4001"
                                                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='collection-date'>
                                                    <div className='date-time'>
                                                        {
                                                            project.lastCollection ?
                                                                <>
                                                                    <span className='date'>{collectionDate}</span>
                                                                    <span className='time'> в {collectionTime}</span>
                                                                </>
                                                                :
                                                                <span className='time'>-</span>
                                                        }
                                                    </div>

                                                    <button onClick={(e) => {
                                                        Api.CollectProject(project.id)

                                                        // @ts-ignore
                                                        e.target.disabled = true
                                                        // @ts-ignore
                                                        e.target.title = 'Идет сбор'
                                                    }} className='restart button'>
                                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linejoin="round"/>
                                                            <path d="M9.6 7.7V15.3L15.9333 11.5L9.6 7.7Z" stroke="#A5AFBB" stroke-width="2" stroke-linejoin="round"/>
                                                        </svg>
                                                        запуск
                                                    </button>
                                        </div>
                                        <div className='queries-count' onClick={() => {
                                            navigate(`/queries?id=${project.id}`)
                                        }}>
                                            {project.queriesCount}
                                        </div>
                                        <div className='top-10'>
                                            <span className='last-top'>{0}%</span>
                                            <span
                                                className={`cur-top ${3 < 0 ? 'negative' : 'positive'}`}>{(3).toLocaleString('en-US', {
                                                signDisplay: 'always'
                                            })}%</span>
                                        </div>
                                        <div className='top-20'>
                                            <span className='last-top'>{1}%</span>
                                            <span
                                                className={`cur-top ${-3 < 0 ? 'negative' : 'positive'}`}>{(-3).toLocaleString('en-US', {
                                                signDisplay: 'always'
                                            })}%</span>
                                        </div>
                                        <div className='top-30'>
                                            <span className='last-top'>{10}%</span>
                                            <span
                                                className={`cur-top ${-30 < 0 ? 'negative' : 'positive'}`}>{(-30).toLocaleString('en-US', {
                                                signDisplay: 'always'
                                            })}%</span>
                                        </div>
                                        <div className='top-50'>
                                            <span className='last-top'>{33}%</span>
                                            <span
                                                className={`cur-top ${-17 < 0 ? 'negative' : 'positive'}`}>{(-17).toLocaleString('en-US', {
                                                signDisplay: 'always'
                                            })}%</span>
                                        </div>
                                        <div className='top-100'>
                                            <span className='last-top'>{100}%</span>
                                            <span
                                                className={`cur-top ${5 < 0 ? 'negative' : 'positive'}`}>{(5).toLocaleString('en-US', {
                                                signDisplay: 'always'
                                            })}%</span>
                                        </div>
                                    </div>
                                })
                            }
                            </div>
                        </div>

                        <div className='buttons'>
                            <button onClick={()=>navigate('/projects/create')} className='add-site button'>
                                <svg width="23" height="22" viewBox="0 0 23 22" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 6H3C1.89543 6 1 6.89543 1 8V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V13.5M16 6H19M19 6H22M19 6V9M19 6V3M13 6V4C13 2.89543 12.1046 2 11 2H9C7.89543 2 7 2.89543 7 4V6H13Z"
                                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span className='text'>Добавить&nbsp;сайт</span>
                            </button>
                            <button className='download-program button'>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.9412 3.11765H4.23529C3.00078 3.11765 2 4.11842 2 5.35294V14.2941C2 15.5286 3.00078 16.5294 4.23529 16.5294H17.6471C18.8816 16.5294 19.8824 15.5286 19.8824 14.2941V12.0588M17.0882 2V8.70588M17.0882 8.70588L14.2941 5.91176M17.0882 8.70588L19.8824 5.91176M10.9412 16.5294V21M6.47059 21H15.4118"
                                        stroke="#1975FF" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                                <span onClick={() => {
                                    const a = document.createElement('a') as HTMLAnchorElement

                                    a.target = '_blank'
                                    a.href = Api.host + '/api/getClient?c=' + Api.secret
                                    a.click()

                                    a.remove()
                                }} className='text'>Скачать&nbsp;программу</span>
                            </button>
                        </div>
                    </div>
                </div>
        }
        { editingMarkerProject !== null &&
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
                          <div key={color.name + 'change-marker'}
                              onClick={() => {
                                  const _ = structuredClone(editingMarkerProject)

                                  _.marker = color.name

                                  setEditingMarkerProject(_)
                              }}
                              className={`color ${color.name} ${editingMarkerProject.marker === color.name ? 'picked' : ''}`}/>
                      )
                  }
              </div>

              <div className='buttons'>
                <span className='cancel' onClick={() => setEditingMarkerProject(null)}>
                    Отменить
                </span>
                <button className='save button'  onClick={() => {
                    const _ = structuredClone(projects)

                    const idx = projects.findIndex(p => p.id === editingMarkerProject.id)
                    _[idx].marker = editingMarkerProject.marker

                    setProjects(_)
                    setEditingMarkerProject(null)
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

              <span className='heading'>Отобразить сайты</span>
              <div className='colors'>
                  {
                      colors.map(color =>
                          <div key={color.name + 'filter'}
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
    </>
}
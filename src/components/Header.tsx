import React, {useEffect, useState} from 'react'
import '../resources/styles/header.css'
import {useLocation, useNavigate} from "react-router";
import {flip, offset, shift, useFloating} from "@floating-ui/react-dom";
import {IUser} from "../types";

interface IHeaderProps {
    user: IUser
}

export default function Header({user}: IHeaderProps) {
    const [projects, setProjects] = useState([
        {
            id: 0,
            site: 'remontаorsunok.ru',
            queriesCount: 6,
            top10last: 0,
            top10: 3,
            top20last: 1,
            top20: -3,
            top30last: 10,
            top30: -30,
            top50last: 33,
            top50: -17,
            top100last: 100,
            top100: 5,
            marker: 'green',
            collectionDate: null
        },
        {
            id: 1,
            site: 'zamm.ru',
            queriesCount: 6,
            top10last: 0,
            top10: 3,
            top20last: 1,
            top20: -3,
            top30last: 10,
            top30: -30,
            top50last: 33,
            top50: -17,
            top100last: 100,
            top100: 5,
            marker: 'green',
            collectionDate: new Date('2022-08-26 14:00')
        },
        {
            id: 2,
            site: 'spb.autoreshenie.ru',
            queriesCount: 1235,
            top10last: 0,
            top10: 3,
            top20last: 1,
            top20: -3,
            top30last: 10,
            top30: -30,
            top50last: 33,
            top50: -17,
            top100last: 100,
            top100: 5,
            marker: 'green',
            collectionDate: new Date('2022-08-26 14:00')
        },

    ])
    const [search, setSearch] = useState<string|null>(null)

    const searchPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 15,
            crossAxis: -20,
        }),
            flip(),
            shift(),
        ],
    })

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(search !== null){
                if(!(e.target as Element).closest('.search-input-container')
                    && !(e.target as Element).closest('.search-popup')){
                    setSearch(null)
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

    return <>
        <div className='header-container'>
            <header className='header'>
                <div className='heading'>
                    <div className='logo'/>
                    <div>
                        <span>Позишен</span>
                        <span>выгодно</span>
                    </div>
                </div>
                <div className='right'>
                    {location.pathname !== '/projects' &&
                    <div className='projects'>
                        <button onClick={() => navigate('/projects')} className='open-projects'>
                            <span className='backpack'/>
                        </button>
                        <div className='search-input-container'>
                            <span className='search-icon'/>
                            <input ref={searchPopup.reference} onChange={(e) => {
                                setSearch(e.target.value)
                            }} value={search ?? ''} placeholder='Поиск сайта' className='search-input'/>
                        </div>
                    </div>
                    }
                    <div className='messages'/>
                    <div className='help'/>
                    <div className='balance-container'>
                        <div className='left'>
                            <div className='wallet'/>
                            <span className='balance'>{user.balance} ₽</span>
                        </div>
                        <span className='plus'/>
                    </div>
                    <div className='cabinet-container'>
                        <div className='avatar'/>
                        <span className='marker'/>
                    </div>
                </div>
            </header>
        </div>
        { search
            && projects.findIndex(p => searchParts(p.site, search)) !== -1
            &&
          <>
            <div
              className = 'search-popup'
              ref={searchPopup.floating}
              style={{
                  position: searchPopup.strategy,
                  top: searchPopup.y ?? 0,
                  left: searchPopup.x ?? 0,
              }}>
                {
                    projects.map(project => {
                        if(!searchParts(project.site, search))
                            return <></>

                        return <div className='search-result'>
                            <span className='name'>{project.site}</span>
                            <svg onClick={() => {
                                const a = document.createElement('a') as HTMLAnchorElement

                                a.target = '_blank'
                                a.href = 'https://' + project.site
                                a.click()

                                a.remove()
                            }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.9999 4.00001L9.24995 12.75M17.9999 4.00001L18 9.25M17.9999 4.00001L12.75 4M9.24998 4.00001H6C4.89543 4.00001 4 4.89544 4 6.00001V16C4 17.1046 4.89543 18 6 18H16C17.1045 18 18 17.1046 18 16V12.75" stroke="#1975FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    })
                }
            </div>
          </>
        }
        </>
}
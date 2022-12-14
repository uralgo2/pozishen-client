import React, {ChangeEvent, FormEvent, MouseEvent, useEffect, useState} from 'react'
import '../resources/styles/projects.create.css'
import {flip, offset, shift, useFloating} from "@floating-ui/react-dom";
import {Api} from "../api";
import {IProject} from "../types";
import {useNavigate} from "react-router";
import {Helmet} from "react-helmet";
import {useSearchParams} from "react-router-dom";
import {extractDomain, validateURL} from "../utils";

export default function ProjectsUpdate(){
    const [time, setTime] = useState({hour: 10, minute: 0})
    const [cities, setCities] = useState(new Set<string>([]))
    const [searchCities, setSearchCities] = useState<string[]>([])
    const [days, setDays] = useState(new Set<string>())
    const [show, setShow] = useState(false)
    const [searchDepth, setSearchDepth] = useState<'100' | '200'>('100')
    const [searchingEngine, setSearchingEngine] = useState(new Set<string>())
    const [siteAddress, setSiteAddress] = useState('')

    const [params]= useSearchParams()

    const navigate = useNavigate()

    const projectId = Number(params.get('id') ?? 0)

    if(!projectId)
        navigate('/projects')

    const searchPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 15,
            crossAxis: 0,
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

    const changeSearchDepth = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.getAttribute('data-value')! as '100' | '200'

        setSearchDepth(value)
    }

    const onChangeSearchingEngine = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.getAttribute('data-value')!

        const _ = structuredClone(searchingEngine) as Set<string>

        if(searchingEngine.has(value))
            _.delete(value)
        else
            _.add(value)

        setSearchingEngine(_)
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(show){
                if(!(e.target as Element).closest('.city-input')
                    && !(e.target as Element).closest('.search-popup')){
                    setShow(false)
                }
            }

        })
    })

    const fetchProject = async () => {
        const res = await Api.GetProject(projectId)

        if('message' in res)
            return

        setDays(new Set(res.parsingDays.split(',')))
        setTime({
            // @ts-ignore
            minute: Number(res.parsingTime.split(':')[1]),
            // @ts-ignore
            hour: Number(res.parsingTime.split(':')[0]),
        })
        setSiteAddress(res.siteAddress)
        setSearchingEngine(new Set(res.searchEngine.split(',')))
        setSearchDepth(res.searchingRange)

        const cities = await Api.GetCities(projectId)

        if('message' in cities)
            return

        setCities(new Set(cities.map(city => city.cityName)))
    }

    const onAddProjectSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if(!validateURL(siteAddress))
            return alert('???????????????? ?????????? ??????????')

        const site = extractDomain(siteAddress)

        const project = {
            parsingDays: Array.from(days),
            parsingTime: `${time.hour}:${time.minute}:00`,
            searchEngine: Array.from(searchingEngine),
            cities: Array.from(cities),
            searchingRange: searchDepth,
            siteAddress: site,
        }

        await Api.UpdateProject(projectId, project)

        navigate('/projects')
    }

    useEffect(() => {
        fetchProject()
    }, [])
    return <>
        <Helmet title='?????????????????? ???????????????? ??????????'/>
        <div className='project-create-container'>
        <form onSubmit={onAddProjectSubmit} className='project-create-form'>
            <span className='header'>?????????????????? ???????????????? ?????????? </span>
            <input required onChange={(e) => setSiteAddress(e.target.value)} value={siteAddress} className='site-input' placeholder='?????????????? ?????????? ??????????'/>
            <div className='searching-engine'>
                <span className='label'>???????????????? ??????????????????</span>
                <div className='checkboxes'>
                    <label>
                        <input
                                required={searchingEngine.size === 0}
                                onChange={onChangeSearchingEngine}
                                checked={searchingEngine.has('yandex')}
                                className='checkbox'
                                type='checkbox'
                                data-value='yandex'
                        />

                        <span>Yandex</span>
                    </label>

                    <label>
                        <input
                            required={searchingEngine.size === 0}
                            onChange={onChangeSearchingEngine}
                            checked={searchingEngine.has('google')}
                            className='checkbox'
                            type='checkbox'
                            data-value='google'
                        />

                        <span>Google</span>
                    </label>

                </div>
            </div>
            <div className='searching-depth'>
                <span className='label'>?????????????? ????????????</span>
                <div className='checkboxes'>
                    <label>
                        <input onChange={changeSearchDepth} checked={searchDepth === '100'} data-value='100' className='checkbox' type='checkbox'/>

                        <span><span>100</span></span>
                    </label>

                    <label>
                        <input onChange={changeSearchDepth} checked={searchDepth === '200'} data-value='200' className='checkbox' type='checkbox'/>

                        <span><span>200</span></span>
                    </label>

                </div>
            </div>
            <div className='cities-container'>
                <input required={cities.size === 0} onFocus={() =>  setShow(true)} onKeyDown={async (e) => {
                    const input = document.querySelector('.city-input') as HTMLInputElement

                    const value = input.value.trim()

                    const res = await Api.SearchCities(value, 10)

                    if('message' in res)
                        return setSearchCities([])

                    setSearchCities(res.map(city => city.name))

                    if(e.key !== 'Enter')
                        return;

                    e.preventDefault()

                    input.blur()

                    if(!value || !searchCities[0]) return

                    const tmp = structuredClone(cities)

                    tmp.add(searchCities[0])

                    input.value = ''

                    setCities(tmp)
                }} className='city-input' type='text' placeholder='?????????????? ???????????????? ????????????' ref={searchPopup.reference}/>
                <div className='cities'>
                    {
                        (() => {
                            const nodes: JSX.Element[] = []

                            cities.forEach(city => nodes.push(<div className='city'>
                                    <span className='name'>{city}</span>
                                    <span onClick={() => {
                                        const _cities = structuredClone(cities)

                                        _cities.delete(city)

                                        setCities(_cities)
                                    }} className='delete'>&times;</span>
                                </div>)
                            )

                            return nodes
                        })()
                    }
                </div>
            </div>
            <div className='time'>
                <span className='label'>?????????? ???????????????? ?????????????? ???? ??????</span>
                <div className='time-container'>
                    <input className='hours' min={0} max={23} step={1}
                           onChange={(e) => setTime({hour: Number(e.target.value) || 0, minute: time.minute})}
                           value={time.hour} type='number'/>
                    <span>:</span>
                    <input className='minutes' min={0} max={59} step={1}
                           onChange={(e) => setTime({hour: time.hour, minute: Number(e.target.value) || 0})}
                           value={time.minute} type='number'/>
                </div>
            </div>
            <div className='days-container'>
                <div className='header'>
                    <span className='label'>???????????????? ?????? ????????????</span>
                    <span
                        onClick={() => setDays(new Set<string>())}
                        className={`off ${days.size > 0 ? 'can' : ''}`}>????????. ????????</span>
                </div>

                <div className='days'>
                    <div
                        data-name='Monday'
                        onClick={toggleDay}
                        className={`day ${days.has('Monday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Tuesday'
                        onClick={toggleDay}
                        className={`day ${days.has('Tuesday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Wednesday'
                        onClick={toggleDay}
                        className={`day ${days.has('Wednesday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Thursday'
                        onClick={toggleDay}
                        className={`day ${days.has('Thursday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Friday'
                        onClick={toggleDay}
                        className={`day ${days.has('Friday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Saturday'
                        onClick={toggleDay}
                        className={`day ${days.has('Saturday') ? 'selected' : ''}`}>????</div>
                    <div
                        data-name='Sunday'
                        onClick={toggleDay}
                        className={`day ${days.has('Sunday') ? 'selected' : ''}`}>????</div>
                </div>
            </div>
            <div className='button-container'>
                <button type='submit' className='button add-site'>
                    ????????????????
                </button>
            </div>
        </form>
    </div>
        {
            (searchCities.length > 0 && show)
            && <div
            className='search-popup cities-popup'
            ref={searchPopup.floating}
            style={{
                position: searchPopup.strategy,
                top: searchPopup.y ?? 0,
                left: searchPopup.x ?? 0,
            }}>
                {
                    searchCities.map(city => {
                        if (cities.has(city))
                            return <></>

                        return <div onClick={() => {
                            const _cities: Set<string> = structuredClone(cities)

                            _cities.add(city)

                            setCities(_cities)

                            document.querySelector<HTMLInputElement>('.city-input')!.value = ''
                        }} className='city'>{city}</div>
                    })
                }
          </div>
        }
    </>
}

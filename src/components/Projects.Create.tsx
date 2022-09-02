import React, {MouseEvent, useState} from 'react'
import '../resources/styles/projects.create.css'

export default function ProjectsCreate(){
    const [time, setTime] = useState({hour: 10, minute: 0})
    const [cities, setCities] = useState(new Set<string>(['Москва']))
    const [days, setDays] = useState(new Set<string>())

    const toggleDay = (e: MouseEvent<HTMLDivElement>) => {
        const day = e.currentTarget.getAttribute('data-name')!

        const _days = structuredClone(days)

        if(_days.has(day))
            _days.delete(day)
        else
            _days.add(day)

        setDays(_days)
    }

    return <div className='project-create-container'>
        <form onSubmit={(e) => {
            e.preventDefault()
        }} className='project-create-form'>
            <span className='header'>Добавить сайт</span>
            <input className='site-input' placeholder='Введите адрес сайта'/>
            <div className='searching-engine'>
                <span className='label'>Выберите поисковик</span>
                <div className='checkboxes'>
                    <label>
                        <input className='checkbox' type='checkbox'/>

                        <span>Yandex</span>
                    </label>

                    <label>
                        <input className='checkbox' type='checkbox'/>

                        <span>Google</span>
                    </label>

                </div>
            </div>
            <div className='searching-depth'>
                <span className='label'>Глубина поиска</span>
                <div className='checkboxes'>
                    <label>
                        <input className='checkbox' type='checkbox'/>

                        <span><span>100</span></span>
                    </label>

                    <label>
                        <input className='checkbox' type='checkbox'/>

                        <span><span>200</span></span>
                    </label>

                </div>
            </div>
            <div className='cities-container'>
                <input onKeyDown={(e) => {
                    if(e.key !== 'Enter')
                        return;

                    const input = document.querySelector('.city-input') as HTMLInputElement

                    const value = input.value.trim()

                    input.blur()

                    if(!value) return

                    const tmp = structuredClone(cities)

                    tmp.add(value)

                    setCities(tmp)
                }} className='city-input' type='text' placeholder='Введите название города'/>
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
                <span className='label'>Когда собирать позиции по МСК</span>
                <div className='time-container'>
                    <input className='hours' min={0} max={23} step={1}
                           onChange={(e) => setTime({hour: Number(e.target.value) || 0, minute: time.minute})}
                           value={time.hour.toString().padStart(2, '0')} type='number'/>
                    <span>:</span>
                    <input className='minutes' min={0} max={59} step={1}
                           onChange={(e) => setTime({hour: time.hour, minute: Number(e.target.value) || 0})}
                           value={time.minute.toString().padStart(2, '0')} type='number'/>
                </div>
            </div>
            <div className='days-container'>
                <div className='header'>
                    <span className='label'>Выберите дни недели</span>
                    <span
                        onClick={() => setDays(new Set<string>())}
                        className={`off ${days.size > 0 ? 'can' : ''}`}>Выкл. сбор</span>
                </div>

                <div className='days'>
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
            <div className='button-container'>
                <button className='button add-site'>
                    Добавить сайт
                </button>
            </div>
        </form>
    </div>
}

import {Link, useSearchParams} from "react-router-dom";
import '../resources/styles/sidebar.css'
import React, {Dispatch, SetStateAction, useState} from "react";
import {useLocation} from "react-router";
import {Api} from "../api";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false)
    const [modal, setModal] = useState<string | null>(null)
    const [link, setLink] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()

    const projectId = Number(searchParams.get('id'))

    const getLink = (link: string) => link + '?' + searchParams.toString()

    const active = (route: string) => {
        if (route === location.pathname)
            return 'active'
        return ''
    }

    return <>
        <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
            {
                location.pathname !== '/queries' &&
                    <>
                        <a onClick={(e) => {
                            if(searchParams.get('filters') !== null){
                                searchParams.delete('filters')
                            }
                            else {
                                searchParams.set('filters', '')
                            }

                            setSearchParams(structuredClone(searchParams))
                        }}>
                            <svg className={`icon settings ${searchParams.get('filters') !== null ? 'active' : ''}`} width="25" height="25" viewBox="0 0 25 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15 3.75C15 2.36929 13.8807 1.25 12.5 1.25C11.1193 1.25 10 2.36929 10 3.75M15 3.75C15 5.13071 13.8807 6.25 12.5 6.25C11.1193 6.25 10 5.13071 10 3.75M15 3.75H22.5M10 3.75L2.5 3.75M17.5 12.5C17.5 13.8807 18.6193 15 20 15C21.3807 15 22.5 13.8807 22.5 12.5C22.5 11.1193 21.3807 10 20 10C18.6193 10 17.5 11.1193 17.5 12.5ZM17.5 12.5H2.5M7.5 21.25C7.5 19.8693 6.38071 18.75 5 18.75C3.61929 18.75 2.5 19.8693 2.5 21.25C2.5 22.6307 3.61929 23.75 5 23.75C6.38071 23.75 7.5 22.6307 7.5 21.25ZM7.5 21.25H22.5"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Фильтры
                </span>
                        </a>

                        <Link to={
                            location.pathname === '/positions/graphics'
                            ? getLink('/positions')
                            : getLink('/positions/graphics')
                        }>
                            <svg className={`icon analytic ${active('/positions/graphics')}`} width="26" height="25"
                                 viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 1.25V23.75M2.5 4.0625H19V9.6875H2.5H25V15.3125H2.5H14.5V20.9375H2.5"
                                      stroke="#A5AFBB"
                                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Графики
                </span>
                        </Link>

                        <Link to={
                            location.pathname === '/positions/percentage'
                                ? getLink('/positions')
                                : getLink('/positions/percentage')
                        }>
                            <svg className={`icon percentage ${active('/positions/percentage')}`} width="25" height="25"
                                 viewBox="0 0 25 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.2894 8.12478C18.6799 7.73426 18.6799 7.10109 18.2894 6.71057C17.8989 6.32004 17.2657 6.32004 16.8752 6.71057L18.2894 8.12478ZM6.71053 16.8752C6.32 17.2657 6.32 17.8989 6.71053 18.2894C7.10105 18.68 7.73421 18.68 8.12474 18.2894L6.71053 16.8752ZM3.37931 2H21.6207V0H3.37931V2ZM23 3.37931V21.6207H25V3.37931H23ZM21.6207 23H3.37931V25H21.6207V23ZM2 21.6207V3.37931H0V21.6207H2ZM16.8752 6.71057L6.71053 16.8752L8.12474 18.2894L18.2894 8.12478L16.8752 6.71057ZM9.51724 8.73276C9.51724 9.16602 9.16602 9.51724 8.73276 9.51724V11.5172C10.2706 11.5172 11.5172 10.2706 11.5172 8.73276H9.51724ZM8.73276 9.51724C8.2995 9.51724 7.94828 9.16602 7.94828 8.73276H5.94828C5.94828 10.2706 7.19493 11.5172 8.73276 11.5172V9.51724ZM7.94828 8.73276C7.94828 8.2995 8.2995 7.94828 8.73276 7.94828V5.94828C7.19493 5.94828 5.94828 7.19493 5.94828 8.73276H7.94828ZM8.73276 7.94828C9.16602 7.94828 9.51724 8.2995 9.51724 8.73276H11.5172C11.5172 7.19493 10.2706 5.94828 8.73276 5.94828V7.94828ZM17.0517 16.2672C17.0517 16.7005 16.7005 17.0517 16.2672 17.0517V19.0517C17.8051 19.0517 19.0517 17.8051 19.0517 16.2672H17.0517ZM16.2672 17.0517C15.834 17.0517 15.4828 16.7005 15.4828 16.2672H13.4828C13.4828 17.8051 14.7294 19.0517 16.2672 19.0517V17.0517ZM15.4828 16.2672C15.4828 15.834 15.834 15.4828 16.2672 15.4828V13.4828C14.7294 13.4828 13.4828 14.7294 13.4828 16.2672H15.4828ZM16.2672 15.4828C16.7005 15.4828 17.0517 15.834 17.0517 16.2672H19.0517C19.0517 14.7294 17.8051 13.4828 16.2672 13.4828V15.4828ZM3.37931 23C2.61754 23 2 22.3825 2 21.6207H0C0 23.487 1.51297 25 3.37931 25V23ZM23 21.6207C23 22.3825 22.3825 23 21.6207 23V25C23.487 25 25 23.487 25 21.6207H23ZM21.6207 2C22.3825 2 23 2.61754 23 3.37931H25C25 1.51297 23.487 0 21.6207 0V2ZM3.37931 0C1.51297 0 0 1.51297 0 3.37931H2C2 2.61754 2.61754 2 3.37931 2V0Z"
                                    fill="#A5AFBB"/>
                            </svg>
                            <span className='label'>
                    % топа
                </span>
                        </Link>

                        <div className='line'/>
                    </>
            }

            <Link to={getLink('/queries')}>
                <svg className={`icon queries ${active('/queries')}`} width="26" height="25" viewBox="0 0 26 25"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.1734 7.64913L21.3877 3.41786M23.7959 1L21.3877 3.41786L23.7959 1ZM12.2245 12.6178C12.8462 13.2337 13.3405 13.9671 13.6788 14.7755C14.0171 15.584 14.1927 16.4517 14.1957 17.3286C14.1986 18.2055 14.0287 19.0744 13.6958 19.8851C13.3629 20.6958 12.8736 21.4324 12.256 22.0525C11.6384 22.6726 10.9047 23.1639 10.0972 23.4981C9.28974 23.8323 8.42437 24.0029 7.55096 24C6.67754 23.997 5.81334 23.8207 5.00809 23.481C4.20285 23.1414 3.47248 22.6451 2.85903 22.0209C1.65268 20.7669 0.985161 19.0873 1.00025 17.3439C1.01534 15.6005 1.71183 13.9328 2.9397 12.7C4.16757 11.4672 5.82859 10.768 7.565 10.7528C9.30141 10.7377 10.9743 11.4079 12.2233 12.619L12.2245 12.6178ZM12.2245 12.6178L17.1734 7.64913L12.2245 12.6178ZM17.1734 7.64913L20.7857 11.2759L25 7.04466L21.3877 3.41786L17.1734 7.64913Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Запросы
                </span>
            </Link>

            <Link to={getLink('/positions')}>
                <svg className={`icon positions ${active('/positions')}`} width="25" height="25" viewBox="0 0 25 25"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.6111 9.94444V18.8889M12.5 6.11111V18.8889M7.38889 13.7778V18.8889M3.55556 24H21.4444C22.8558 24 24 22.8558 24 21.4444V3.55556C24 2.14416 22.8558 1 21.4444 1H3.55556C2.14416 1 1 2.14416 1 3.55556V21.4444C1 22.8558 2.14416 24 3.55556 24Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Позиции
                </span>
            </Link>

            {
                location.pathname !== '/queries' && <>
                        <Link to='/competitors'>
                            <svg className='icon referral' width="27" height="25" viewBox="0 0 27 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.3182 21.25V20.0893C20.3182 17.5251 18.2831 15.4464 15.7727 15.4464H11.2273C8.71689 15.4464 6.68182 17.5251 6.68182 20.0893V21.25M26 21.25V20.0893C26 17.5251 23.9649 15.4464 21.4545 15.4464H20.8864M1 21.25V20.0893C1 17.5251 3.03507 15.4464 5.54545 15.4464H6.11364M19.1818 11.9643C21.0646 11.9643 22.5909 10.4053 22.5909 8.48214C22.5909 6.55901 21.0646 5 19.1818 5M7.81818 11.9643C5.93539 11.9643 4.40909 10.4053 4.40909 8.48214C4.40909 6.55901 5.93539 5 7.81818 5M16.9091 8.48214C16.9091 10.4053 15.3828 11.9643 13.5 11.9643C11.6172 11.9643 10.0909 10.4053 10.0909 8.48214C10.0909 6.55901 11.6172 5 13.5 5C15.3828 5 16.9091 6.55901 16.9091 8.48214Z"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Конкуренты
                </span>
                        </Link>

                        <Link to={getLink('/projects/update')}>
                            <svg className='icon settings-gear' width="25" height="25" viewBox="0 0 25 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.94444 2.27778C9.94444 1.57208 10.5165 1 11.2222 1H13.7778C14.4835 1 15.0556 1.57208 15.0556 2.27778V3.00456C15.0556 3.55119 15.4224 4.02609 15.9273 4.2357C16.4323 4.44538 17.0204 4.36546 17.407 3.97879L17.9211 3.46472C18.4201 2.96571 19.2291 2.96571 19.7282 3.46472L21.5352 5.27177C22.0342 5.77077 22.0342 6.57981 21.5352 7.07882L21.0212 7.59282C20.6345 7.97952 20.5546 8.5676 20.7643 9.07267C20.9739 9.57755 21.4488 9.94444 21.9955 9.94444L22.7222 9.94444C23.4279 9.94444 24 10.5165 24 11.2222V13.7778C24 14.4835 23.4279 15.0556 22.7222 15.0556H21.9955C21.4488 15.0556 20.9739 15.4224 20.7643 15.9273C20.5546 16.4324 20.6345 17.0204 21.0212 17.4071L21.5352 17.9211C22.0342 18.4201 22.0342 19.2292 21.5352 19.7282L19.7282 21.5352C19.2292 22.0342 18.4201 22.0342 17.9211 21.5352L17.4071 21.0212C17.0204 20.6345 16.4324 20.5546 15.9273 20.7643C15.4224 20.9739 15.0556 21.4488 15.0556 21.9955V22.7222C15.0556 23.4279 14.4835 24 13.7778 24H11.2222C10.5165 24 9.94444 23.4279 9.94444 22.7222V21.9955C9.94444 21.4488 9.57755 20.9739 9.07267 20.7643C8.5676 20.5546 7.97952 20.6345 7.59282 21.0212L7.0788 21.5352C6.57979 22.0342 5.77075 22.0342 5.27175 21.5352L3.4647 19.7282C2.96569 19.2292 2.96569 18.4201 3.46469 17.9211L3.97879 17.407C4.36546 17.0204 4.44538 16.4323 4.2357 15.9273C4.02609 15.4224 3.55119 15.0556 3.00456 15.0556H2.27778C1.57208 15.0556 1 14.4835 1 13.7778V11.2222C1 10.5165 1.57208 9.94444 2.27778 9.94444L3.00453 9.94444C3.55118 9.94444 4.0261 9.57756 4.23571 9.0727C4.4454 8.56764 4.36548 7.97959 3.9788 7.5929L3.46472 7.07882C2.96571 6.57982 2.96571 5.77077 3.46472 5.27177L5.27177 3.46472C5.77077 2.96572 6.57982 2.96572 7.07882 3.46472L7.59289 3.9788C7.97958 4.36548 8.56764 4.4454 9.0727 4.23571C9.57756 4.0261 9.94444 3.55118 9.94444 3.00453V2.27778Z"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path
                                    d="M15.0556 12.5C15.0556 13.9114 13.9114 15.0556 12.5 15.0556C11.0886 15.0556 9.94444 13.9114 9.94444 12.5C9.94444 11.0886 11.0886 9.94444 12.5 9.94444C13.9114 9.94444 15.0556 11.0886 15.0556 12.5Z"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Настройки
                </span>
                        </Link>

                        <a onClick={() => setModal('invite')}>
                            <svg className='icon invite' width="26" height="25" viewBox="0 0 26 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.25 23.75V21.3889C20.25 18.7809 18.1234 16.6667 15.5 16.6667H6C3.37665 16.6667 1.25 18.7809 1.25 21.3889V23.75M21.4375 8.40278V15.4861M17.875 11.9444L25 11.9444M15.5 7.22222C15.5 9.83023 13.3734 11.9444 10.75 11.9444C8.12665 11.9444 6 9.83023 6 7.22222C6 4.61421 8.12665 2.5 10.75 2.5C13.3734 2.5 15.5 4.61421 15.5 7.22222Z"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Гостевой доступ
                </span>
                        </a>

                        <a onClick={async () => {
                            setModal('refresh')
                            await Api.CollectProject(projectId)
                        }}>
                            <svg className='icon refresh' width="25" height="25" viewBox="0 0 25 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 2V9.33333M2 9.33333H9.33333M2 9.33333L5.22701 6.43748C6.91491 4.75256 9.10473 3.66178 11.4665 3.32952C13.8283 2.99725 16.2341 3.4415 18.3214 4.59531C20.4087 5.74912 22.0645 7.55 23.0393 9.7266M24 24V16.6667M24 16.6667L16.6667 16.6667M24 16.6667L20.7729 19.5625C19.085 21.2475 16.8952 22.3382 14.5335 22.6705C12.1717 23.0028 9.76588 22.5585 7.67856 21.4047C5.59123 20.2509 3.93545 18.45 2.9607 16.2734"
                                    stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span className='label'>
                    Запустить сбор
                </span>
                        </a>
                    </>
            }

            <div className='line'/>

            <Link to='/projects'>
                <svg className='icon projects' width="26" height="27" viewBox="0 0 26 27" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M25 11.2941V23.0588C25 24.6832 23.6708 26 22.0312 26H4.21875C2.57915 26 1.25 24.6832 1.25 23.0588V11.2941M17.5781 5.41176V3.94118C17.5781 2.31681 16.249 1 14.6094 1H11.6406C10.001 1 8.67188 2.31681 8.67188 3.94118V5.41176M13.125 14.2353V20.1176M4.21875 17.1765H22.0312C23.6708 17.1765 25 15.8597 25 14.2353V8.35294C25 6.72857 23.6708 5.41176 22.0312 5.41176H4.21875C2.57915 5.41176 1.25 6.72857 1.25 8.35294V14.2353C1.25 15.8597 2.57915 17.1765 4.21875 17.1765Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Проекты
                </span>
            </Link>

            <Link to='/'>
                <svg className='icon quad' width="25" height="25" viewBox="0 0 25 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H10.75V10.75H2V2Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M2 14.5H10.75V23.25H2V14.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M14.5 2H23.25V10.75H14.5V2Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M14.5 14.5H23.25V23.25H14.5V14.5Z" stroke="#A5AFBB" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Позишен
                </span>
            </Link>

            <div className='expand-container' onClick={() => setExpanded(!expanded)}>
                <svg className='icon expand' width="26" height="25" viewBox="0 0 26 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.5542 17.5L24.75 11.875M24.75 11.875L18.5542 6.25M24.75 11.875L1 11.875M7.19578 6.25L1 11.875M1 11.875L7.19578 17.5"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Свернуть меню
                </span>
            </div>

            <div className='line'/>

            <Link to='/balance'>
                <svg className='icon wallet' width="25" height="25" viewBox="0 0 25 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.0556 12.5V12.5141M3.55556 22H21.4444C22.8558 22 24 20.7398 24 19.1852V5.81481C24 4.26024 22.8558 3 21.4444 3H3.55556C2.14416 3 1 4.26024 1 5.81482V19.1852C1 20.7398 2.14416 22 3.55556 22ZM24 8.27778H15.0556C12.9385 8.27778 11.2222 10.1681 11.2222 12.5C11.2222 14.8319 12.9385 16.7222 15.0556 16.7222H24V8.27778Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Баланс
                </span>
            </Link>

            <Link to='/cabinet'>
                <svg className='icon avatar' width="25" height="25" viewBox="0 0 25 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 20.8778C20 18.322 17.928 16.25 15.3722 16.25H9.62784C7.07195 16.25 5 18.322 5 20.8778M16.25 8.75C16.25 10.8211 14.5711 12.5 12.5 12.5C10.4289 12.5 8.75 10.8211 8.75 8.75C8.75 6.67893 10.4289 5 12.5 5C14.5711 5 16.25 6.67893 16.25 8.75ZM23.75 12.5C23.75 18.7132 18.7132 23.75 12.5 23.75C6.2868 23.75 1.25 18.7132 1.25 12.5C1.25 6.2868 6.2868 1.25 12.5 1.25C18.7132 1.25 23.75 6.2868 23.75 12.5Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Профиль
                </span>
            </Link>

            <Link to='/messages'>
                <svg className='icon messages' width="25" height="25" viewBox="0 0 25 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.25004 11.875C1.24573 13.5249 1.6312 15.1524 2.37504 16.625C3.25699 18.3897 4.61285 19.874 6.29072 20.9116C7.9686 21.9493 9.90223 22.4993 11.875 22.5C13.5249 22.5043 15.1524 22.1189 16.625 21.375L23.75 23.75L21.375 16.625C22.1189 15.1524 22.5043 13.5249 22.5 11.875C22.4993 9.90223 21.9493 7.9686 20.9116 6.29072C19.874 4.61285 18.3897 3.25699 16.625 2.37504C15.1524 1.6312 13.5249 1.24573 11.875 1.25004H11.25C8.6446 1.39378 6.18373 2.49349 4.33861 4.33861C2.49349 6.18373 1.39378 8.6446 1.25004 11.25V11.875Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Задать вопрос
                </span>
            </Link>

            <Link to='/help'>
                <svg className='icon help' width="25" height="25" viewBox="0 0 25 25" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.5 18.7375V18.75M12.5 15C12.5 12.5 16.25 12.5 16.25 9.88636C16.25 7.87806 14.6042 6.25 12.5 6.25C10.7247 6.25 9.17295 7.40888 8.75 8.97727M23.75 12.5C23.75 18.7132 18.7132 23.75 12.5 23.75C6.2868 23.75 1.25 18.7132 1.25 12.5C1.25 6.2868 6.2868 1.25 12.5 1.25C18.7132 1.25 23.75 6.2868 23.75 12.5Z"
                        stroke="#A5AFBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className='label'>
                    Справка
                </span>
            </Link>
        </div>
        {
            modal === 'invite' &&
          <>
            <div className='modal invite'>
              <div className='head row'>
                <span>Гостевая ссылка</span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body invite column'>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    setLink('https://pozishen.ru/inv=5195')
                }} className='column' name='authForm'>
                  <div className='invite-checkboxes column'>
                    <label className='row'>
                      <input checked type='checkbox'/>
                      <span className='row'>
                        Частота запросов
                      </span>
                    </label>
                    <label className='row'>
                      <input checked type='checkbox'/>
                      <span className='row'>
                        Визиты
                      </span>
                    </label>
                    <label className='row'>
                      <input id='remember-me' type='checkbox'/>
                      <span className='row'>
                        Выбор дат
                      </span>
                    </label>
                    <label className='row'>
                      <input id='remember-me' type='checkbox'/>
                      <span className='row'>
                        Сводка
                      </span>
                    </label>
                    <label className='row'>
                      <input id='remember-me' type='checkbox'/>
                      <span className='row'>
                        Расширенная сводка
                      </span>
                    </label>
                    <label className='row'>
                      <input id='remember-me' type='checkbox'/>
                      <span className='row'>
                        Конкуренты
                      </span>
                    </label>
                  </div>

                  <div className='column' style={{gap: 20}}>
                    <button type='submit'>Поделиться</button>
                      {
                          link && <div className='row link'>
                          {link}
                        <button onClick={() => navigator.clipboard.writeText(link)} className='cpy' />
                      </div>
                      }
                  </div>
                </form>
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
        {
            modal === 'refresh' &&
          <>
            <div className='modal refresh'>
              <div className='head row'>
                <span></span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body column'>
                <div className='load2'>
                    <div className='loader'>Loading...</div>
                </div>
                <div className='column' style={{gap: 10}}>
                  <span className='heading'>
                    Сбор начался, ожидайте
                  </span>
                  <span className='sub-heading'>
                    Сбор будет завершен, когда кнопка станет активна
                  </span>
                </div>
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
    </>
}
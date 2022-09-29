import React, {Dispatch, SetStateAction, useEffect, useState, MouseEvent} from 'react'
import '../resources/styles/header.css'
import {useLocation, useNavigate} from "react-router";
import {flip, offset, shift, useFloating} from "@floating-ui/react-dom";
import {IProject, IUser} from "../types";
import {useSearchParams} from "react-router-dom";
import {Api} from "../api";
import {IMainPageProps} from "./MainPage";

interface IHeaderProps {
    user: IUser | null,
    projects: IProject[],
    setProjects: Dispatch<SetStateAction<IProject[]>>,
    setModal: (s: string | null) => void,
    modal: string | null,
    setMenuOpened: (b: boolean) => void,
    menuOpened: boolean
}

export default function Header({user, projects, setProjects, modal, setModal, menuOpened, setMenuOpened}: IHeaderProps) {
    const [search, setSearch] = useState<string | null>(null)
    const [enterCode, setEnterCode] = useState(false)
    const searchPopup = useFloating({
        placement: 'bottom',
        middleware: [offset({
            mainAxis: 15,
            crossAxis: -22.5,
        }),
            shift(),
        ],
    })

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (search !== null) {
                if (!(e.target as Element).closest('.search-input-container')
                    && !(e.target as Element).closest('.search-popup')) {
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

        for (const part of parts) {
            const pretty = part.trim()

            if (pretty.length && str.search(pretty) !== -1)
                return true
        }

        return false
    }

    const toggleMask = (e: MouseEvent<HTMLElement>) => {
        const parent = e.currentTarget.closest('.input.maskable')!
        const input = parent.querySelector('input')!

        input.type =
            input.type === 'text' ? 'password'
                : 'text'
    }
    return <>
        {
            menuOpened &&
          <div className='menu-mobile'>
            <div className='menu-main'>
              <span className='heading'>Личный кабинет</span>
              <div className='buttons'>
                <button className='register'>
                  <div className='icon'/>
                  <span onClick={() => {
                      setModal('register')
                      setMenuOpened(false)
                  }} className='text'>Регистрация</span>
                </button>
                <button className='login'>
                  <div className='icon'/>
                  <span onClick={() => {
                      setModal('login')
                      setMenuOpened(false)
                  }} className='text'>Вход</span>
                </button>
              </div>
            </div>
            <div className='links'>
              <a onClick={() => setMenuOpened(false)} href='#how-works'>Как работает</a>
              <a onClick={() => setMenuOpened(false)} href='#tariff'>Тарифы</a>
              <a onClick={() => setMenuOpened(false)} href='#interface'>Интерфейс</a>
            </div>
          </div>
        }
        <div className='header-container'>
            <header className='header'>
                <div className='heading'>
                    <div className='logo'/>
                    <div>
                        <span>Позишен</span>
                        <span>выгодно</span>
                    </div>
                </div>
                {!user &&
                  <>
                    <div className='middle'>
                      <div className='links'>
                        <a href='#how-works'>Как работает</a>
                        <a href='#tariff'>Тарифы</a>
                        <a href='#interface'>Интерфейс</a>
                      </div>
                    </div>
                    <div className='right unauthorized'>
                      <div className='item login'>
                        <div className='icon'/>
                        <span className='label' onClick={() => setModal('login')}>Вход</span>
                      </div>
                      <div className='item register'>
                        <div className='icon'/>
                        <span className='label' onClick={() => setModal('register')}>Регистрация</span>
                      </div>
                    </div>
                  </>
                }
                {user &&
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
                }
                <div onClick={() => setMenuOpened(!menuOpened)} className='mobile-open-menu'>
                    {
                        menuOpened ?
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.14923 7L22 22M21.8508 7L7 22" stroke="#A5AFBB" stroke-width="2"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            :
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 22H25M5 15H25M5 8H25" stroke="#A5AFBB" stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>

                    }
                </div>
            </header>
        </div>
        {search
            && projects.findIndex(p => searchParts(p.siteAddress, search)) !== -1
            &&
          <>
            <div
              className='search-popup'
              ref={searchPopup.floating}
              style={{
                  position: searchPopup.strategy,
                  top: searchPopup.y ?? 0,
                  left: searchPopup.x ?? 0,
              }}>
                {
                    projects.map(project => {
                        if (!searchParts(project.siteAddress, search))
                            return <></>

                        return <div className='search-result'>
                            <span onClick={() => {
                                if (location.pathname === '/queries')
                                    navigate(`?id=${project.id}`)

                            }} className='name'>{project.siteAddress}</span>
                            <svg onClick={() => {
                                const a = document.createElement('a') as HTMLAnchorElement

                                a.target = '_blank'
                                a.href = 'https://' + project.siteAddress
                                a.click()

                                a.remove()
                            }} width="22" height="22" viewBox="0 0 22 22" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17.9999 4.00001L9.24995 12.75M17.9999 4.00001L18 9.25M17.9999 4.00001L12.75 4M9.24998 4.00001H6C4.89543 4.00001 4 4.89544 4 6.00001V16C4 17.1046 4.89543 18 6 18H16C17.1045 18 18 17.1046 18 16V12.75"
                                    stroke="#1975FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    })
                }
            </div>
          </>
        }
        {
            modal === 'login' &&
          <>
            <div className='modal login'>
              <div className='head row'>
                <span>Вход</span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body column'>
                <form onSubmit={async (e) => {
                    e.preventDefault()

                    const form = document.forms.namedItem('authForm')!

                    const email = form['mail'] as HTMLInputElement
                    const password = form['password'] as HTMLInputElement

                    const logged = await Api.Login(email.value, password.value)

                    if(logged === true) {
                        setModal(null)
                        navigate('/projects')
                    }
                    else {
                        alert(logged)
                        return false
                    }
                }} className='column' name='authForm'>
                  <input required placeholder='Введите почту' name='mail' type='email' className='mail'/>

                  <div className='input maskable'>
                    <input required placeholder='Введите пароль' name='password' type='password' className='password maskable'/>
                    <div onClick={toggleMask} className='eye'/>
                  </div>
                  <div className='row'>
                    <label className='row'>
                      <input id='remember-me' type='checkbox'/>
                      <span className='row'>
                        Запомнить меня
                      </span>
                    </label>
                    <span className='forget blue'>Забыли пароль?</span>
                  </div>

                  <button type='submit'>Войти</button>
                </form>
                <span className='help'>Ещё нет аккаунта? <span className='blue link'
                                              onClick={() => setModal('register')}>Зарегистрироваться</span></span>
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
        {
            modal === 'register' &&
          <>
            <div className='modal register'>
              <div className='head row'>
                <span>Регистрация</span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body column'>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    const form = document.forms.namedItem('registerForm')!

                    const email = form['mail'] as HTMLInputElement
                    const password = form['password'] as HTMLInputElement
                    const checkPassword = form['checkPassword'] as HTMLInputElement

                    if(password.value !== checkPassword.value)
                        return checkPassword.setCustomValidity('Пароли не совпадают')

                    const logged = await Api.Signup(email.value, password.value)


                    if(logged === true) {
                        setModal(null)
                        navigate('/projects')
                    }
                    else {
                        alert(logged)
                        return false
                    }
                }}  className='column' name='registerForm'>
                  <input required placeholder='Введите почту' name='mail' type='email' className='mail'/>
                  <div className='input maskable'>
                    <input required placeholder='Введите пароль' name='password' type='password' className='password maskable'/>
                    <div onClick={toggleMask} className='eye'/>
                  </div>
                  <div className='input maskable'>
                    <input required placeholder='Повторите пароль' name='checkPassword' type='password' className='password maskable'/>
                    <div onClick={toggleMask} className='eye'/>
                  </div>
                  <button type='submit'>Зарегистрироваться</button>
                </form>
                <span className='help'>
                Нажимая на кнопку вы соглашаетесь с <a className='blue'>Пользовательским соглашением</a> и <a
                  className='blue'>Обработкой персональных данных</a>
              </span>
                <span className='help'>Уже есть аккаунт? <span className='blue link' onClick={() => setModal('login')}>Войти</span></span>
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
        {
            modal === 'confirmation' &&
          <>
            <div onSubmit={(e) => {
                e.preventDefault()
                if(!enterCode) setEnterCode(true)
            }} className='modal confirmation'>
              <div className='head row'>
                <span>Подтверждение</span>
                <span className='close' onClick={() => setModal(null)}>&times;</span>
              </div>
              <div className='body column'>
                <form className='column'>
                  <div className='column info'>
                    <span>Для получения Бонуса - <span className='blue'>2500 бесплатных запросов,</span> подтвердите свой Телеграмм</span>
                    <div className='row'>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.25 13.4444C8.25 13.8587 8.58579 14.1944 9 14.1944C9.41421 14.1944 9.75 13.8587 9.75 13.4444H8.25ZM9.75 7.22222C9.75 6.80801 9.41421 6.47222 9 6.47222C8.58579 6.47222 8.25 6.80801 8.25 7.22222H9.75ZM8.25 4.56441C8.25 4.97863 8.58579 5.31441 9 5.31441C9.41421 5.31441 9.75 4.97863 9.75 4.56441H8.25ZM9.75 4.55553C9.75 4.14131 9.41421 3.80553 9 3.80553C8.58579 3.80553 8.25 4.14131 8.25 4.55553H9.75ZM9.75 13.4444L9.75 7.22222H8.25L8.25 13.4444H9.75ZM9.75 4.56441V4.55553H8.25V4.56441H9.75ZM16.25 9C16.25 13.0041 13.0041 16.25 9 16.25V17.75C13.8325 17.75 17.75 13.8325 17.75 9H16.25ZM9 16.25C4.99594 16.25 1.75 13.0041 1.75 9H0.25C0.25 13.8325 4.16751 17.75 9 17.75V16.25ZM1.75 9C1.75 4.99594 4.99594 1.75 9 1.75V0.25C4.16751 0.25 0.25 4.16751 0.25 9H1.75ZM9 1.75C13.0041 1.75 16.25 4.99594 16.25 9H17.75C17.75 4.16751 13.8325 0.25 9 0.25V1.75Z" fill="#A5AFBB"/>
                      </svg>
                      <span>Мера по борьбе со спамом</span>
                    </div>
                  </div>
                  <div className='column'>
                    <input required placeholder='@nickname' name='nickname' type='text' className='nickname'/>
                    <span>для уведомлений и восстановления пароля</span>
                  </div>
                    {
                        enterCode && <div className='column enter-code'>
                        <span>Введите код</span>
                        <input/>
                    </div>
                    }
                  <button type='submit'>{enterCode ? 'Подтвердить' : 'Отправить код'}</button>
                </form>
                  {
                      enterCode ? <span className='help'>Не пришел код? <span
                              className='blue link'>Отправить повторно</span></span>
                          : <span className='help'>
                      Нажимая на кнопку вы соглашаетесь с <a className='blue'>Пользовательским соглашением</a> и <a
                              className='blue'>Обработкой персональных данных</a>
                      </span>
                  }
              </div>
            </div>
            <div className='modal-background' onClick={() => setModal(null)}/>
          </>
        }
    </>
}


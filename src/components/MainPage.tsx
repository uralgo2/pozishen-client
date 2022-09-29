import React, {useState} from "react"
import '../resources/styles/main-page.css'
import {Helmet} from "react-helmet";

export interface IMainPageProps {
    setModal: (s: string | null) => void,
    modal: string | null
}
function MainPage({setModal, modal} : IMainPageProps) {

    return <>
        <Helmet title='Главная'/>
        <div className='main-page'>
            <div className='main row'>
                <div className='container column'>
                    <div className='row'>
                        <div className='column info'>
                            <span className='heading'>
                                <span className='blue'>Выгодный</span> мониторинг позиций сайтов
                            </span>
                            <span className='sub-heading'>
                                <span className='blue'>от 1,5</span> копейки за запрос
                            </span>
                            <div className='row'>
                                <button onClick={() => {
                                    setModal('register')
                                }} className='register button'>Зарегистрироваться</button>
                                <span className='text'>
                                    При&nbsp;регистрации&nbsp;— <span className='blue'>2500&nbsp;запросов</span> бесплатно!
                                </span>
                            </div>
                        </div>
                        <div className='column logo'/>
                    </div>
                    <div className='row beta-test'>
                        <span className='text'>
                            Весь Сентябрь открытый Бета-тест&nbsp;— попробуйте бесплатно!
                        </span>
                        <svg className='arrow' width="52" height="17" viewBox="0 0 52 17" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1 1C14.7657 7.38793 31.7725 10.4098 47.0286 7.8739M39.3517 1.88753C43.0285 5.61441 47.3539 7.81987 51 7.2138C47.3539 7.81987 44.0279 11.2972 41.8335 16"
                                stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <svg className='arrow-mobile' width="30" height="37" viewBox="0 0 30 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29 1C24.1415 13.6594 15.1713 26.1515 3.927 33.9658M5.15937 25.3389C5.09308 30.0265 3.68731 34.1324 1 36C3.68731 34.1324 7.92087 34.3193 12.1819 35.9995" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>

                        <button>
                            Участвовать
                        </button>

                        <div className='lines-mobile'>
                            <svg width="186" height="225" viewBox="0 0 186 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M24.6496 -36.2747L126.874 229.104L87.024 225.84C87.024 225.84 -40.4321 -44.1088 -39.9989 -44L24.6496 -36.2747ZM56.5948 -32.4665L134.238 229.104L186 234L145.608 -21.8035L56.5948 -32.4665Z" fill="url(#paint0_linear_416_867)"/>
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_416_867" x1="0.404768" y1="-142.032" x2="193.451" y2="260.35" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#93A57F"/>
                                        <stop offset="0.0668103" stop-color="#80906F"/>
                                        <stop offset="0.2204" stop-color="#59644D"/>
                                        <stop offset="0.376" stop-color="#394031"/>
                                        <stop offset="0.5317" stop-color="#20241C"/>
                                        <stop offset="0.6874" stop-color="#0E100C"/>
                                        <stop offset="0.8433" stop-color="#040403"/>
                                        <stop offset="1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className='lines-left'>
                            <svg width="125" height="119" viewBox="0 0 125 119" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path
                                        d="M1.4884 -52.081L79.7401 151.249L49.2352 148.748C49.2352 148.748 -48.3307 -58.0833 -47.9992 -58L1.4884 -52.081ZM25.942 -49.1632L85.3768 151.249L125 155L94.0807 -40.9933L25.942 -49.1632Z"
                                        fill="url(#paint0_linear_416_227)"/>
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_416_227" x1="-17.0707" y1="-133.111" x2="130.924"
                                                    y2="175.084" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#93A57F"/>
                                        <stop offset="0.0668103" stop-color="#80906F"/>
                                        <stop offset="0.2204" stop-color="#59644D"/>
                                        <stop offset="0.376" stop-color="#394031"/>
                                        <stop offset="0.5317" stop-color="#20241C"/>
                                        <stop offset="0.6874" stop-color="#0E100C"/>
                                        <stop offset="0.8433" stop-color="#040403"/>
                                        <stop offset="1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className='lines-right'>
                            <svg width="127" height="119" viewBox="0 0 127 119" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path
                                        d="M123.512 153.081L45.26 -50.2485L75.7648 -47.7476C75.7648 -47.7476 173.331 159.083 172.999 159L123.512 153.081ZM99.058 150.163L39.6232 -50.2485L1.86211e-05 -54L30.9193 141.993L99.058 150.163Z"
                                        fill="url(#paint0_linear_416_228)"/>
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_416_228" x1="142.071" y1="234.111" x2="-5.92363"
                                                    y2="-74.0838" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#93A57F"/>
                                        <stop offset="0.0668103" stop-color="#80906F"/>
                                        <stop offset="0.2204" stop-color="#59644D"/>
                                        <stop offset="0.376" stop-color="#394031"/>
                                        <stop offset="0.5317" stop-color="#20241C"/>
                                        <stop offset="0.6874" stop-color="#0E100C"/>
                                        <stop offset="0.8433" stop-color="#040403"/>
                                        <stop offset="1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className='sub-main row grey'>
                <div className='container row'>
                    <svg className='lines' width="382" height="320" viewBox="0 0 382 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M109.275 -70.9392L282.062 377.722L214.704 372.204C214.704 372.204 -0.730286 -84.1839 0.00186192 -83.9999L109.275 -70.9392ZM163.271 -64.5009L294.508 377.722L382 386L313.727 -46.4735L163.271 -64.5009Z" fill="url(#paint0_linear_416_636)"/>
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_416_636" x1="68.2948" y1="-249.738" x2="394.714" y2="430.492" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#93A57F"/>
                                <stop offset="0.0668103" stop-color="#80906F"/>
                                <stop offset="0.2204" stop-color="#59644D"/>
                                <stop offset="0.376" stop-color="#394031"/>
                                <stop offset="0.5317" stop-color="#20241C"/>
                                <stop offset="0.6874" stop-color="#0E100C"/>
                                <stop offset="0.8433" stop-color="#040403"/>
                                <stop offset="1"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className='column'>
                        <span className='text'>
                            Скрестили декстопную программу и онлайн сервис, получили:
                            <svg className='small-star' width="18" height="16" viewBox="0 0 18 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.7732 1.48765C10.2645 -0.495886 7.26678 -0.495883 6.75804 1.48765L7.40676 5.28769C7.22496 5.99652 6.63693 6.54996 5.8838 6.72107L1.84625 6.11051C-0.261252 6.58932 -0.26125 9.41068 1.84626 9.88949L5.8838 9.27893C6.63693 9.45004 7.22496 10.0035 7.40676 10.7123L6.75804 14.5124C7.26678 16.4959 10.2645 16.4959 10.7732 14.5123L10.1245 10.7123C10.3063 10.0035 10.8943 9.45004 11.6475 9.27893L15.685 9.88949C17.7925 9.41068 17.7925 6.58932 15.685 6.11051L11.6475 6.72107C10.8943 6.54996 10.3063 5.99652 10.1245 5.28769L10.7732 1.48765Z"
                                    fill="#FFA319"/>
                            </svg>
                            <svg className='big-star' width="28" height="29" viewBox="0 0 28 29" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17.0704 4.15205C16.2923 0.928807 11.7076 0.928811 10.9296 4.15206L11.9217 10.3271C11.6437 11.479 10.7443 12.3783 9.5925 12.6564L3.41743 11.6642C0.194188 12.4423 0.19419 17.027 3.41744 17.805L9.5925 16.8129C10.7443 17.0909 11.6437 17.9903 11.9217 19.1421L10.9296 25.3172C11.7077 28.5404 16.2924 28.5404 17.0704 25.3172L16.0783 19.1421C16.3563 17.9903 17.2557 17.0909 18.4075 16.8129L24.5826 17.805C27.8058 17.027 27.8058 12.4423 24.5826 11.6642L18.4075 12.6564C17.2557 12.3783 16.3563 11.479 16.0783 10.3271L17.0704 4.15205Z"
                                    fill="#FFA319" stroke="#F1F4F9" stroke-width="1.5"/>
                            </svg>
                        </span>
                    </div>
                    <div className='column'>
                        <div className='row item'>
                            <div className='icon'/>
                            <div className='column'>
                                <span className='heading'>Удобство</span>
                                <span className='sub-heading'>Онлайн сервисов</span>
                            </div>
                        </div>
                        <div className='row item'>
                            <div className='icon'/>
                            <div className='column'>
                                <span className='heading'>Низкую стоимость</span>
                                <span className='sub-heading'>Десктопных программ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='how-works' className='how-works column'>
                <div className='container'>
                    <span className='heading'>Как работает</span>
                    <div className='row'>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Устанавливаете программу
                        </span>
                            <span className='sub-heading'>
                            Не обязательно, но цена будет в 2 раза выше
                        </span>
                        </div>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Добавляете запросы на сайте
                        </span>
                            <span className='sub-heading'>
                            Быстро списком или импорт через Эксель
                        </span>
                        </div>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Получаете отчет по&nbsp;позициям
                        </span>
                            <span className='sub-heading'>
                            В запланированное вами&nbsp;время
                        </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='benefits column grey'>
                <div className='container column'>
                    <div className='row'>
                        <svg className='lines' width="760" height="840" viewBox="0 0 760 840" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M217.406 -54.0174L561.17 838.532L427.16 827.554C427.16 827.554 -1.45292 -80.3658 0.00370434 -79.9999L217.406 -54.0174ZM324.832 -41.2092L585.933 838.532L760 855L624.169 -5.34618L324.832 -41.2092Z" fill="url(#paint0_linear_416_223)"/>
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_416_223" x1="135.874" y1="-409.713" x2="785.207" y2="943.553" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#93A57F"/>
                                <stop offset="0.0668103" stop-color="#80906F"/>
                                <stop offset="0.2204" stop-color="#59644D"/>
                                <stop offset="0.376" stop-color="#394031"/>
                                <stop offset="0.5317" stop-color="#20241C"/>
                                <stop offset="0.6874" stop-color="#0E100C"/>
                                <stop offset="0.8433" stop-color="#040403"/>
                                <stop offset="1"/>
                            </linearGradient>
                        </defs>
                    </svg>
                        <div className='icon'/>
                        <div className='column'>
                            <span className='heading'>Не нагружает компьютер</span>
                            <div className='icon-mobile'/>
                            <div className='list'>
                                <span className='item'>Отслеживает <span
                                    className='grey'>нагрузку</span> компьютера</span>
                                <span className='item'><span className='grey'>Собирает</span>, когда есть свободные ресурсы</span>
                                <span className='item'>Можете задать <span className='grey'>ограничение</span> на ресурсы</span>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='icon'/>
                        <div className='column'>
                            <span className='heading'>Собирает, когда выключена</span>
                            <div className='icon-mobile'/>
                            <div className='list'>
                                <span
                                    className='item'><span className='grey'>В простое</span> помогает выполнять задачи других, зарабатывая вам баллы</span>
                                <span
                                    className='item'>За баллы, вам <span className='grey'>помогают</span> другие, когда у вас программа выключена</span>
                                <span className='item'>Когда баллы закончатся, идет <span
                                    className='grey'>плавное</span> повышение тарифа до начального</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='interface' className='interface column'>
                <div className='container'>
                    <span className='heading'>Экскурсия по интерфейсу</span>
                    <div className='player'>
                        <div className='image'>
                            <div onClick={() => {
                                setModal('player')
                            }} className='icon-play'/>
                        </div>
                        <div className='mascot'/>
                    </div>
                </div>
            </div>
            <div className='add-in-month column grey'>
                <div className='container'>
                    <svg className='lines' width="406" height="422" viewBox="0 0 406 422" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M116.14 -36.1333L299.783 440.211L228.194 434.352C228.194 434.352 -0.776168 -50.1952 0.0019789 -49.9999L116.14 -36.1333ZM173.529 -29.2977L313.011 440.211L406 449L333.438 -10.158L173.529 -29.2977Z" fill="url(#paint0_linear_416_261)"/>
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_416_261" x1="72.5856" y1="-225.964" x2="418.916" y2="496.523" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#93A57F"/>
                                <stop offset="0.0668103" stop-color="#80906F"/>
                                <stop offset="0.2204" stop-color="#59644D"/>
                                <stop offset="0.376" stop-color="#394031"/>
                                <stop offset="0.5317" stop-color="#20241C"/>
                                <stop offset="0.6874" stop-color="#0E100C"/>
                                <stop offset="0.8433" stop-color="#040403"/>
                                <stop offset="1"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className='heading'>Добавим в этом месяце</span>
                    <div className='row'>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Партнерская система
                        </span>
                        </div>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Оплата для юр лиц
                        </span>
                        </div>
                        <div className='column'>
                            <div className='icon'/>
                            <span className='heading'>
                            Создание API
                        </span>
                        </div>
                    </div>
                </div>
            </div>
            <div id='tariff' className='tariff column'>
                <div className='container column'>
                    <span className='heading'>Тарифы</span>
                    <div className='tariff-table'>
                        <div className='tariff-header'>
                            <span className='header'>Установлена программа</span>
                            <span className='header'>Расход в прошлом месяце</span>
                            <span className='header'>Стоимость 1&nbsp;запроса</span>
                        </div>
                        <div className='tariff-body'>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Ноль</span>
                                <div className='border'>
                                    <div className='program-installed no'/>
                                    <span className='min-expense'>от 0 ₽</span>
                                    <span className='price'>0,05 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Джун</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>0-300 ₽</span>
                                    <span className='price'>0,02 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Мидл</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>300-500 ₽</span>
                                    <span className='price'>0,019 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Сеньор</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>501-1000 ₽</span>
                                    <span className='price'>0,018 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Марио</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>1001-3000 ₽</span>
                                    <span className='price'>0,017 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Принц</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>3001-10000 ₽</span>
                                    <span className='price'>0,016 ₽</span>
                                </div>
                            </div>
                            <div className='tariff-item'>
                                <div className='icon'/>
                                <span className='name'>Босс</span>
                                <div className='border'>
                                    <div className='program-installed'/>
                                    <span className='min-expense'>от 10 001 ₽</span>
                                    <span className='price'>0,015 ₽</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tariffs-mobile'>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Ноль</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed no'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>от 0 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,05 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Джун</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>0-300 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,02 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Мидл</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>300-500 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,019 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Сеньор</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>501-1000 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,018 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Марио</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>1001-3000 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,017 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Принц</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>3001-10000 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,016 ₽</span>
                        </div>
                        <div className='tariff-item'>
                            <div className='icon'/>
                            <span className='name'>Босс</span>
                            <span className='heading'>Установлена программа</span>
                            <div className='program-installed'/>
                            <span className='heading'>Расход в прошлом месяце</span>
                            <span className='min-expense'>от 10 001 ₽</span>
                            <span className='heading'>Стоимость 1&nbsp;запроса</span>
                            <span className='price'>0,015 ₽</span>
                        </div>
                    </div>
                    <button className='add-site button'>Добавить свой сайт</button>
                    <span className='text'>Попробуйте сервис - <span className='blue'>2500&nbsp;запросов</span> бесплатно!</span>
                </div>
            </div>
        </div>

        <div className={`player-modal ${modal === 'player' ? 'opened' : ''}`}>
            <div className='player'>
                <iframe src='https://youtube.com/embed/0Rr8X764fYY'/>
            </div>
            <div className='close' onClick={() => setModal(null)}>&times;</div>
            <div className='background' onClick={() => setModal(null)}/>
        </div>
    </>
}

export default MainPage
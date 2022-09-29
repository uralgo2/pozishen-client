import React from "react"
import '../resources/styles/footer.css'
// todo написать стили

function Footer() {
    return <>
        <div className='footer'>
            <div className='copyright'>
                <div className='logo-container'>
                    <div className='logo'/>
                    <div className='header'>
                        <span className='heading'>Позишен</span>
                        <span className='sub-heading'>выгодно</span>
                    </div>
                </div>
                <span className='text'>
                    @ 2022 Позишен - <br/>все права защищены
                </span>
            </div>
            <div className='payments'>
                <div className='tinkoff'/>
                <div className='ur-pay'/>
                <div className='apple-pay'/>
                <div className='google-pay'/>
                <div className='sber-pay'/>
                <div className='qiwi'/>
                <div className='mastercard'/>
                <div className='visa'/>
                <div className='mir'/>
                <div className='sbp'/>
                <div className='yoo-money'/>
                <div className='paddle'/>
            </div>
            <div className='links'>
                <a href='#'>Пользовательское соглашение</a>
                <a href='#'>Обработка персональных данных</a>
                <a href='#'>Политика использования Cookie</a>
            </div>
        </div>
    </>
}

export default Footer
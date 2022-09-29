import {useEffect, useState} from "react";
import {Scrollbar} from "react-scrollbars-custom";

interface IPercentageProps {
    data: {
        [date: string]: {
            [x: number]: {
                val: number,
                diff: number
            }
        }
    }
}

export default function Percentage({data}: IPercentageProps){
    const times = [0, 1, 2, 3, 4]

    useEffect(() => {
        document.querySelector('.percentage-table')!
            .scrollTo(document.body.scrollWidth, 0)
    }, [data])
    return <>
    <Scrollbar
        thumbXProps={{
            className: 'thumbX'
        }}
        trackXProps={{
            className: 'trackX'
        }}
        noScrollY={true}
        noDefaultStyles={true}
        maximalThumbSize={100}
        minimalThumbSize={100}>
        <div className='percentage-table'>
            <div className='wrapper'>
                <div className='row header'>
                <div>Топ</div>
                    {
                        times.map(() =>
                            Object.keys(data).map(date => {
                                return <div key={date + '-header'}>{date}</div>
                            })
                        )
                    }
            </div>
                <div className='row body'>
                <div className='column'>
                    <div>Топ 3</div>
                    <div>Топ 5</div>
                    <div>Топ 10</div>
                    <div>Топ 20</div>
                    <div>Топ 50</div>
                    <div>Топ 100</div>
                </div>

                    {
                        times.map(() =>
                            Object.keys(data).map(date => {
                                return <div key={date + '-column'} className='column'>
                                    <div>
                                <span className='percentage'>{
                                    data[date][3].val
                                        ? data[date][3].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][3].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][3].diff === 0
                                            ? ''
                                            : data[date][3].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>

                                    <div>
                                <span className='percentage'>{
                                    data[date][5].val
                                        ? data[date][5].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][5].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][5].diff === 0
                                            ? ''
                                            : data[date][5].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>

                                    <div>
                                <span className='percentage'>{
                                    data[date][10].val
                                        ? data[date][10].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][10].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][10].diff === 0
                                            ? ''
                                            : data[date][10].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>

                                    <div>
                                <span className='percentage'>{
                                    data[date][20].val
                                        ? data[date][20].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][20].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][20].diff === 0
                                            ? ''
                                            : data[date][20].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>

                                    <div>
                                <span className='percentage'>{
                                    data[date][50].val
                                        ? data[date][50].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][50].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][50].diff === 0
                                            ? ''
                                            : data[date][50].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>

                                    <div>
                                <span className='percentage'>{
                                    data[date][100].val
                                        ? data[date][100].val.toFixed(0) + '%'
                                        : '—'
                                }</span>
                                        <span className={`diff ${data[date][100].diff >= 0 ? 'positive' : 'negative'}`}>
                                    {
                                        data[date][100].diff === 0
                                            ? ''
                                            : data[date][100].diff.toLocaleString('ru', {
                                                signDisplay: 'always',
                                                maximumFractionDigits: 0,
                                            })
                                    }
                                </span>
                                    </div>
                                </div>
                            })
                        )
                    }
            </div>
            </div>
        </div>
    </Scrollbar>
    </>
}
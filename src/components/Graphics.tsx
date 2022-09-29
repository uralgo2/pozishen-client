import {useEffect, useState} from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    LineChart,
    ResponsiveContainer,
    Line
} from "recharts";

interface IGraphicsProps {
    data: {
        [date: string]:
            {
                id: number,
                pos: number,
                diff: number,
                chd?: boolean
            }[]
    },
    searchingEngine: 'yandex' | 'google'
}

interface topData {
    name: string,
    date?: string,
    top3: number,
    top5: number,
    top10: number,
    top20: number,
    top50: number,
    top100: number
}

export function Graphics({data, searchingEngine}: IGraphicsProps) {
    enum EGraphic {
        Tops,
        Dynamic,
        AveragePositions,
        Visibility,
    }

    const [tops, setTops] = useState<topData[]>([{
        name: 'initial',
        top3: 10,
        top5: 10,
        top10: 10,
        top20: 10,
        top50: 10,
        top100: 50,
    }])
    const [graphic, setGraphic] = useState(EGraphic.Tops)
    const [dataVisibility] = useState([
        {
            name: '4.09.2022',
            v: 0
        },
        {
            name: '5.09.2022',
            v: 0
        },
        {
            name: '6.09.2022',
            v: 0
        },
        {
            name: '7.09.2022',
            v: 1
        },
        {
            name: '8.09.2022',
            v: 24
        },
        {
            name: '9.09.2022',
            v: 2
        },
        {
            name: '10.09.2022',
            v: 23,
            date: 'сентябрь'
        },
        {
            name: '11.09.2022',
            v: 12
        },
        {
            name: '12.09.2022',
            v: 6
        },
        {
            name: '13.09.2022',
            v: 34
        },
        {
            name: '14.09.2022',
            v: 20
        },
        {
            name: '15.09.2022',
            v: 23
        },
        {
            name: '16.09.2022',
            v: 12
        },
        {
            name: '4.08.2022',
            v: 2
        },
        {
            name: '5.08.2022',
            v: 18
        },
        {
            name: '6.08.2022',
            v: 34
        },
        {
            name: '7.08.2022',
            v: 15
        },
        {
            name: '8.08.2022',
            v: 24
        },
        {
            name: '9.08.2022',
            v: 2
        },
        {
            name: '10.08.2022',
            v: 24,
            date: 'август'
        },
        {
            name: '11.08.2022',
            v: 12
        },
        {
            name: '12.08.2022',
            v: 6
        },
        {
            name: '13.08.2022',
            v: 34
        },
        {
            name: '14.08.2022',
            v: 20
        },
        {
            name: '15.08.2022',
            v: 23
        },
        {
            name: '16.08.2022',
            v: 12,
            date: '2022'
        },
    ])
    useEffect(() => {
        /*
        const tops: topData[] = Object.keys(tops)
            .map(date => {

                const top3 = topsRaw[date][3].val
                const top5 = topsRaw[date][5].val
                const top10 = topsRaw[date][10].val
                const top20 = topsRaw[date][20].val
                const top50 = topsRaw[date][50].val
                const top100 = topsRaw[date][100].val

                const top3h = top3
                const top5h = top5 - top3h
                const top10h = top10 - top5h - top3h
                const top20h = top20 - top10h - top5h - top3h
                const top50h = top50 - top20h - top5h - top5h - top3h
                const top100h = top100 === top50 ? 0 : top100 - top50h - top20h - top10h - top5h - top3h


                return {
                    name: date.split('.')[0],
                    top3: top3h,
                    top5: top5 ? top5h : 0,
                    top10: top10 ? top10h : 0,
                    top20: top20 ? top20h : 0,
                    top50: top50 ? top50h : 0,
                    top100: top100 ? top100h : 0,
                }
            })

        setTops(tops)
        */
        const tops: topData[] = []

        const keys = Object.keys(data).reverse()

        for (const date of keys) {
            const dateData = data[date]
            const length = dateData.length

            const top3 = dateData.filter(el => el.pos && el.pos <= 3).length / length
            const top5 = dateData.filter(el => el.pos && el.pos > 3 && el.pos <= 5).length / length
            const top10 = dateData.filter(el => el.pos && el.pos > 5 && el.pos <= 10).length / length
            const top20 = dateData.filter(el => el.pos && el.pos > 10 && el.pos <= 20).length / length
            const top50 = dateData.filter(el => el.pos && el.pos > 20 && el.pos <= 50).length / length
            const top100 = dateData.filter(el => el.pos && el.pos > 50 && el.pos <= 100).length / length

            tops.push({
                name: date,
                top3: top3 * 100,
                top5: top5 * 100,
                top10: top10 * 100,
                top20: top20 * 100,
                top50: top50 * 100,
                top100: top100 * 100,
            })
        }

        const past: typeof keys = structuredClone(keys)

        for (const date of keys) {
            const parts = date.split('.')
            const month = parts[1]
            const year = parts[2]
            const months = tops.filter(({name: value}) => value.split('.')[1] === month
                && value.split('.')[2] === year)

            const middle = months[Math.ceil(months.length / 2)]

            const date_ = MyDate('20' + parts[2], Number(parts[1])-1, parts[0])
            middle.date = date_.toLocaleDateString('ru', {
                month: 'long'
            })

            const lastYear = tops.find(({name: value}) => value.split('.')[2] === year)!

            lastYear.date = '20' + parts[2]
        }

        setTops(tops.reverse())
    }, [data])

    const tickFormatter = (v: number) => {
        return v.toLocaleString('ru', {minimumFractionDigits: 1})
    }

    const legendTextFormatter = (value: string) => <span className="legend-label">{value}</span>

    // @ts-ignore
    const MyDate = (year: string | number, month: string|number, day: string|number) => new Date(year, month, day)

    const dateDayTickFormatter = (value: string) => {
        if(!value.split)
            return ''

        const _ = value.split('.').reverse()

        // @ts-ignore
        const date = MyDate(_[0], _[1] - 1, _[2])

        return date.getDate().toString()
    }

    const dateMonthTickFormatter = function(value: string) {

        if(!value) return ''
        return value
    }
    return <>
        <div className='graphics row'>
            <div className='graphics-sidebar column'>
                <button
                    onClick={() => setGraphic(EGraphic.Tops)}
                    className={`btn ${graphic === EGraphic.Tops ? 'active' : ''}`}>Топы
                </button>
                <button className={`btn ${graphic === EGraphic.Dynamic ? 'active' : ''}`}>Динамика</button>
                <button className={`btn ${graphic === EGraphic.AveragePositions ? 'active' : ''}`}>Средние позиции
                </button>
                <button
                    onClick={() => setGraphic(EGraphic.Visibility)}
                    className={`btn ${graphic === EGraphic.Visibility ? 'active' : ''}`}>Видимость
                </button>
            </div>
            <div className={`graphics-container ${EGraphic[graphic]}`}>

                {
                    graphic === EGraphic.Tops
                    &&
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                        //width={1390}
                        //height={500}
                      data={tops}
                      margin={{
                          top: 30,
                          right: 30,
                          left: 20,
                          bottom: 30,
                      }}
                      barSize={12}
                      maxBarSize={12}
                      barGap={0}
                      barCategoryGap={0}
                      style={{background: '#fff', borderRadius: 7}}
                    >
                      <XAxis
                            tickMargin={10}
                             axisLine={false} tickLine={false}
                             tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                             label={{ value: '', angle: 0, position: 'bottom' }}
                             xAxisId={0}
                             dataKey="name"
                             tickFormatter={dateDayTickFormatter}/>
                      <XAxis
                             axisLine={false} tickLine={false}
                             tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                             label={{ value: '', angle: 0, position: 'bottom' }}
                             xAxisId={1} dataKey="date"
                             tickFormatter={dateMonthTickFormatter}
                             interval={0}/>
                      <YAxis tickFormatter={tickFormatter}
                             axisLine={false} tickLine={false}
                             domain={[0, 100]}
                             ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                             tickMargin={10}
                             tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                      />
                      <Legend
                        iconType='square'
                        formatter={legendTextFormatter}
                        align='right'
                        verticalAlign='top'
                        margin={{top: 20, bottom: 20}}
                        wrapperStyle={{
                        paddingBottom: 20
                      }}
                      />
                        {
                            //<Tooltip/>
                        }
                        {
                            searchingEngine === 'yandex'
                                ? <Bar name='%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Яндекс' dataKey='empty'/>
                                : <Bar name='%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Google' dataKey='empty'/>
                        }
                      <Bar name='Топ 3' dataKey="top3" stackId="a" fill="#01008A"/>
                      <Bar name='Топ 5' dataKey="top5" stackId="a" fill="#0000FE"/>
                      <Bar name='Топ 10' dataKey="top10" stackId="a" fill="#2E9C18"/>
                      <Bar name='Топ 20' dataKey="top20" stackId="a" fill="#FEFE84"/>
                      <Bar name='Топ 50' dataKey="top50" stackId="a" fill="#FBD182"/>
                      <Bar name='Топ 100' dataKey="top100" stackId="a" fill="#D7D7D7"/>
                      <CartesianGrid stroke='#A5AFBB' strokeDasharray="4 4"/>
                    </BarChart>
                  </ResponsiveContainer>
                }
                {
                    graphic === EGraphic.Visibility
                    &&
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={dataVisibility}
                      style={{background: '#fff', borderRadius: 7}}
                      margin={{
                          top: 30,
                          right: 30,
                          left: 20,
                          bottom: 30,
                      }}

                    >
                      <XAxis
                             tickMargin={10}
                             axisLine={false} tickLine={false}
                             tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                             label={{ value: '', angle: 0, position: 'bottom' }}
                             xAxisId={0}
                             dataKey="name"
                             tickFormatter={dateDayTickFormatter}/>
                      <XAxis
                               axisLine={false} tickLine={false}
                               tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                               label={{ value: '', angle: 0, position: 'bottom' }}
                               xAxisId={1}
                               dataKey="date"
                               tickFormatter={dateMonthTickFormatter}
                                interval={0}
                      />
                      <YAxis
                        axisLine={false} tickLine={false}
                        tickFormatter={tickFormatter}
                        domain={[0, 100]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tick={{fontSize: 14, color: '#34495E', fill: '#34495E', fontWeight: 400}}
                      />
                        {
                            //<Tooltip/>
                        }
                      <Legend payload={[
                          {
                              value: '%',
                              type: 'square',
                              color: '#34495E',
                              id: 'ID)))]-)@#',
                          },
                          {
                              value: searchingEngine === 'yandex' ? 'Яндекс' : 'Google',
                              type: 'plainline',
                              color: '#248012',
                              id: 'ID))))@#',
                              payload: {strokeDasharray: ''},
                        }
                      ]}
                              formatter={legendTextFormatter}
                              iconType='plainline'
                              align='right'
                              verticalAlign='top'
                              margin={{bottom: 20}}
                              wrapperStyle={{
                                  paddingBottom: 20
                              }}
                      />
                      <Line
                        type="linear"
                        dataKey="v"
                        fill='#248012'
                        stroke="#248012"
                        dot={{stroke: '#248012',r: 3.5}}
                        activeDot={{r: 3.5}}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                      <CartesianGrid stroke='#A5AFBB' strokeDasharray="3 3"/>
                    </LineChart>
                  </ResponsiveContainer>
                }
            </div>
        </div>
    </>
}
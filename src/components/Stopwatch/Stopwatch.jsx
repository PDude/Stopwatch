import React, { useCallback, useEffect, useState } from 'react'
import style from './Stopwatch.module.css'
import { interval, Subject, Observable, of } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [isActiveBtn, setActiveBtn] = useState(false)
  const [stopwatchState, setStopwatchState] = useState('stop')

  // ***

  useEffect(() => {
    const unsubscribe$ = new Subject()
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (stopwatchState === 'start') {
          setSeconds((value) => value + 1000)
        }
      })

    return () => {
      unsubscribe$.next()
      unsubscribe$.complete()
    }
  }, [stopwatchState])

  // ***

  const startStopwatch = useCallback(() => {
    setStopwatchState('start')
  }, [])

  const stopStopwatch = useCallback(() => {
    setStopwatchState('stop')
    setSeconds(0)
  }, [])

  const resetStopwatch = useCallback(() => {
    setSeconds(0)
  }, [])

  // Using Observable and Hooks
  const waitStopwatch = () => {
    setActiveBtn(true)

    const observable = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(false)
        isActiveBtn && setStopwatchState('wait')
        subscriber.complete()
      }, 300)
    })

    observable.subscribe((value) => {
      setActiveBtn(value)
    })
  }

  // Using just Hooks
  // const waitStopwatch = () => {
  //   setActiveBtn(true)
  //   isActiveBtn && setStopwatchState('wait')
  //   setTimeout(() => {
  //     setActiveBtn(false)
  //   }, 300)
  // }

  // Or we can use doubleClick

  return (
    <section className={style.stopwatch_section}>
      <div className={style.stopwatch_wrap}>
        <p className={style.stopwatch_content}>
          {new Date(seconds).toISOString().slice(11, 19)}
        </p>
        <div className={style.stopwatch_btns}>
          {stopwatchState === 'stop' || stopwatchState === 'wait' ? (
            <button onClick={startStopwatch}>Start</button>
          ) : stopwatchState === 'start' || stopwatchState === 'reset' ? (
            <button onClick={stopStopwatch}>Stop</button>
          ) : null}
          <button
            onClick={waitStopwatch} // 300 ms
            title={'Use doubleclick to activate'}>
            Wait
          </button>
          <button onClick={resetStopwatch}>Reset</button>
        </div>
        <p className={style.author}>
          Made by
          <a href='https://www.instagram.com/shalldon_/' target={'_blank'}>
            Shalldon
          </a>
        </p>
      </div>
    </section>
  )
}

export default Stopwatch

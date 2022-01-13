import React, { FC, useEffect, useState } from "react";
import * as styles from "./BgmPlayer.styles";
import next from "next";
import { getCurrentSection } from "../lib/time_table";
import { Bgm, getCurrentRandomBgm } from "../lib/bgm";
import Wave from "@foobar404/wave"

const BgmPlayer: FC = () => {
    const [lastSectionId, setLastSectionId] = useState(0)
    const [audioTitle, setAudioTitle] = useState('BGMタイトル')
    const [audioArtist, setAudioArtist] = useState('BGMアーティスト')
    let [initialized, setInitialized] = useState(false)

    const audioDivId = 'music'
    const audioCanvasId = 'audioCanvas'

    const updateState = () => {
        const audio = document.getElementById('music') as HTMLAudioElement
        const currentSection = getCurrentSection()

        // sectionIdが0から変わるタイミングでチャイムを再生
        if (lastSectionId === 0 && currentSection.sectionId !== 0) {
            // partTypeに応じたbgmをランダムに選択
            const bgm = getCurrentRandomBgm(currentSection?.partName)
            if (bgm !== null) {
                chime1Play()
                setLastSectionId(currentSection.sectionId)
            }
        }
        // sectionIdが0になるタイミングでチャイムを再生
        if (lastSectionId !== 0 && currentSection.sectionId === 0) {
            chime2Play()
            setLastSectionId(currentSection.sectionId)
        }
    }

    const audioStart = () => {
        const audio = document.getElementById('music') as HTMLAudioElement
        audio.addEventListener('ended', function () {
            console.log('ended.')
            setAudioTitle('BGMタイトル')
            setAudioArtist('BGMアーティスト')
            audioNext()
        })
        audio.addEventListener('error', function () {
            console.log('error loading audio file.')
            audioNext()
        })
        audioNext()
    }

    const audioNext = () => {
        const audio = document.getElementById('music') as HTMLAudioElement
        const currentSection = getCurrentSection()
        const bgm = getCurrentRandomBgm(currentSection.partName)
        audio.src = bgm.file
        setAudioTitle(bgm.title)
        setAudioArtist(bgm.artist)
        audio.volume = 0.6
        audio.play()
    }

    const stop = () => {
        const audio = document.getElementById('music') as HTMLAudioElement
        audio.pause()
        setAudioTitle('BGMタイトル')
        setAudioArtist('BGMアーティスト')
    }

    const chime1Play = () => {
        const chime1 = document.getElementById('chime1') as HTMLAudioElement
        chime1.volume = 0.4
        chime1.play()
    }

    const chime2Play = () => {
        const chime2 = document.getElementById('chime2') as HTMLAudioElement
        chime2.volume = 0.4
        chime2.play()
    }

    useEffect(() => {
        // console.log('useEffect')
        if (!initialized) {
            setInitialized(true)

            let wave = new Wave()
            const waveOptions = {
                type: 'wave',
                colors: ['#000', '#111'],
                stroke: 0
            }
            wave.fromElement(audioDivId, audioCanvasId, waveOptions)

            audioStart()
        }
        const intervalId = setInterval(() => updateState(), 1000)
        return () => {
            // console.log('クリーンアップ')
            clearInterval(intervalId)
        }
    }, [updateState, audioStart, audioNext, stop])   // この第２引数がないといけない。。。


    return (
        <>
            <div css={styles.bgmPlayer}>
                <audio autoPlay id={audioDivId}></audio>

                <audio id='chime1' src="/chime/chime1.mp3"></audio>
                <audio id='chime2' src="/chime/chime2.mp3"></audio>
                <h4>♪ {audioTitle}</h4>
                <h4>by {audioArtist}</h4>
            </div>
            <div css={styles.audioCanvasDiv}>
                <canvas id={audioCanvasId} css={styles.audioCanvas}></canvas>
            </div>
        </>
    )
}


export default BgmPlayer;

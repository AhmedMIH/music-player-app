import React, {useEffect, createContext, useState} from 'react'
import {View, Text, Alert} from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import {DataProvider} from 'recyclerlistview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Audio} from 'expo-av'
import {playNext} from '../utility/audioController'
import {storeAudioForNextOpening} from '../utility/helper'

export const AudioContext = createContext()

const AudioProvider = ({children}) => {
  const [audioFiles, setAutoFiles] = useState([])
  const [permissionError, setPermissionError] = useState(false)
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1 !== r2)
  )
  const [playback, setPlayback] = useState(null)
  const [soundObj, setSoundObj] = useState(null)
  const [currentAudio, setCurrentAudio] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null)
  const [totalAudioCount, setTotalAudioCount] = useState(null)
  const [playbackPosition, setPlaybackPosition] = useState(null)
  const [playbackDuration, setPlaybackDuration] = useState(null)

  useEffect(() => {
    getPermissions()
    if (playback === null) {
      setPlayback(new Audio.Sound())
    }
  }, [])

  const onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      setPlaybackPosition(playbackStatus.positionMillis)
      setPlaybackDuration(playbackStatus.durationMillis)
    }

    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = currentAudioIndex + 1
      if (nextAudioIndex >= totalAudioCount) {
        playback.unloadAsync()
        setSoundObj(null)
        setCurrentAudio(audioFiles[0])
        setIsPlaying(false)
        setPlaybackPosition(null)
        setPlaybackDuration(null)
        setCurrentAudioIndex(0)
        return await storeAudioForNextOpening(audioFiles[0], 0)
      }
      const audio = audioFiles[nextAudioIndex]
      const status = await playNext(playback, audio.uri)
      setSoundObj(status)
      setCurrentAudio(audio)
      setIsPlaying(true)
      setCurrentAudioIndex(nextAudioIndex)
      await storeAudioForNextOpening(audio, nextAudioIndex)
    }
  }

  const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({mediaType: 'audio'})
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount,
    })
    setTotalAudioCount(media.totalCount)
    setAutoFiles([...media.assets])
    setDataProvider(dataProvider.cloneWithRows([...media.assets]))
  }

  const loadPreviouseAudio = async () => {
    let previousAudio = await AsyncStorage.getItem('previousAudio')
    let currentAudio1
    let currentAudioIndex1

    if (previousAudio === null) {
      currentAudio1 = audioFiles[0]
      currentAudioIndex1 = 0
    } else {
      previousAudio = JSON.parse(previousAudio)
      currentAudio1 = previousAudio.audio
      currentAudioIndex1 = previousAudio.index
    }
    setCurrentAudio(currentAudio1)
    setCurrentAudioIndex(currentAudioIndex1)
  }

  const permissionAlert = async () => {
    Alert.alert('Permission Required', 'This app need to read audio files ', [
      {
        text: 'I am Ready',
        onPress: () => getPermissions(),
      },
      {
        text: 'cancle',
        onPress: () => permissionAlert(),
      },
    ])
  }

  const getPermissions = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync()
    if (permission.granted) {
      getAudioFiles()
    }

    if (!permission.canAskAgain && !permission.granted) {
      setPermissionError(true)
    }

    if (!permission.granted && permission.canAskAgain) {
      const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync()
      if (status === 'denied' && canAskAgain) {
        permissionAlert()
      }
      if (status === 'granted') {
        getAudioFiles()
      }
      if (status === 'denied' && !canAskAgain) {
        setPermissionError(true)
      }
    }
  }

  const updatePlaybackObjState = (newState) => {
    setPlayback(newState)
  }
  const updateCurrentAudioState = (newState) => {
    setCurrentAudio(newState)
  }
  const updateSoundObjState = (newState) => {
    setSoundObj(newState)
  }

  const updateIsPlayingState = (newState) => {
    setIsPlaying(newState)
  }
  const updateCurrentAudioIndexState = (newState) => {
    setCurrentAudioIndex(newState)
  }

  const updatePlaybackPosition = (newState) => {
    setPlaybackPosition(newState)
  }
  const updatePlaybackDuration = (newState) => {
    setPlaybackDuration(newState)
  }

  return permissionError ? (
    <View>
      <Text>It is Look likes you havent accept the permission</Text>
    </View>
  ) : (
    <AudioContext.Provider
      value={{
        audioFiles,
        dataProvider,
        playback,
        soundObj,
        currentAudio,
        isPlaying,
        currentAudioIndex,
        totalAudioCount,
        playbackPosition,
        playbackDuration,
        updateCurrentAudioState,
        setPlayback,
        updatePlaybackObjState,
        updateSoundObjState,
        updateIsPlayingState,
        updateCurrentAudioIndexState,
        updatePlaybackPosition,
        updatePlaybackDuration,
        loadPreviouseAudio,
        onPlaybackStatusUpdate,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export default AudioProvider

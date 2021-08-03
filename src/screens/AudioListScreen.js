import React, {useState, useContext, useEffect} from 'react'
import {Text, StyleSheet, Dimensions} from 'react-native'
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import {Audio} from 'expo-av'

import AudioListItem from '../components/AudioListItem'
import OptionModal from '../components/OptionModal'
import Screen from '../components/Screen'
import {AudioContext} from '../context/AudioProvider'
import {play, pause, resume, playNext} from '../utility/audioController'
import {storeAudioForNextOpening} from '../utility/helper'

const AudioListScreen = () => {
  const [optionModalVisible, setOptionModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const {
    audioFiles,
    playback,
    soundObj,
    currentAudio,
    isPlaying,
    currentAudioIndex,
    totalAudioCount,
    setPlayback,
    updateCurrentAudioState,
    updatePlaybackObjState,
    updateSoundObjState,
    updateIsPlayingState,
    updateCurrentAudioIndexState,
    updatePlaybackPosition,
    updatePlaybackDuration,
    loadPreviouseAudio,
    onPlaybackStatusUpdate,
  } = useContext(AudioContext)
  useEffect(() => {
    loadPreviouseAudio()
  }, [])

  useEffect(() => {
    if (playback !== null) {
      playback.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    } else {
    }
  }, [playback])

  /* const onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      updatePlaybackPosition(playbackStatus.positionMillis)
      updatePlaybackDuration(playbackStatus.durationMillis)
    }

    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = currentAudioIndex + 1
      if (nextAudioIndex >= totalAudioCount) {
        playback.unloadAsync()
        updateSoundObjState(null)
        updateCurrentAudioState(audioFiles[0])
        updateIsPlayingState(false)
        updatePlaybackPosition(null)
        updatePlaybackDuration(null)
        updateCurrentAudioIndexState(0)
        return await storeAudioForNextOpening(audioFiles[0], 0)
      }
      const audio = audioFiles[nextAudioIndex]
      const status = await playNext(playback, audio.uri)
      updateSoundObjState(status)
      updateCurrentAudioState(audio)
      updateIsPlayingState(true)
      updateCurrentAudioIndexState(nextAudioIndex)
      await storeAudioForNextOpening(audio, nextAudioIndex)
    }
  }*/

  const handleAudioPress = async (audio) => {
    if (soundObj === null) {
      const playbackObj = new Audio.Sound()
      const status = await play(playbackObj, audio.uri)
      const index = audioFiles.indexOf(audio)

      updateSoundObjState(status)
      updateIsPlayingState(true)
      updateCurrentAudioIndexState(index)
      updateCurrentAudioState(audio)
      setPlayback(playbackObj)
      return storeAudioForNextOpening(audio, index)
    } else {
      if (
        soundObj.isLoaded &&
        soundObj.isPlaying &&
        currentAudio.id === audio.id
      ) {
        const status = await pause(playback)
        updateIsPlayingState(false)
        return updateSoundObjState(status)
      }

      if (
        soundObj.isLoaded &&
        !soundObj.isPlaying &&
        currentAudio.id === audio.id
      ) {
        const status = await resume(playback)
        updateIsPlayingState(true)
        return updateSoundObjState(status)
      }

      if (soundObj.isLoaded && currentAudio.id !== audio.id) {
        const status = await playNext(playback, audio.uri)
        const index = audioFiles.indexOf(audio)
        updateCurrentAudioIndexState(index)
        updateCurrentAudioState(audio)
        updateIsPlayingState(true)
        updateSoundObjState(status)
        return storeAudioForNextOpening(audio, index)
      }
    }
  }

  const layoutProvider = new LayoutProvider(
    (index) => 'audio',
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 70
    }
  )

  const rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        duration={item.duration}
        activeListItem={currentAudioIndex === index}
        onOptionPress={() => {
          setCurrentItem(item)
          setOptionModalVisible(true)
        }}
        onAudioPress={() => handleAudioPress(item)}
      />
    )
  }

  return (
    <AudioContext.Consumer>
      {({dataProvider}) => {
        return dataProvider._data.length !== 0 ? (
          <Screen>
            <RecyclerListView
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={rowRenderer}
              extendedState={{isPlaying}}
            />
            <OptionModal
              currentItem={currentItem}
              visible={optionModalVisible}
              onClose={() => setOptionModalVisible(false)}
              onPlayListPress={() => {}}
              onPlayPress={() => {}}
            />
          </Screen>
        ) : null
      }}
    </AudioContext.Consumer>
  )
}

export default AudioListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

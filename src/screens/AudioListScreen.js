import React, {useState, useContext} from 'react'
import {Text, StyleSheet, Dimensions} from 'react-native'
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import {Audio} from 'expo-av'

import AudioListItem from '../components/AudioListItem'
import OptionModal from '../components/OptionModal'
import Screen from '../components/Screen'
import {AudioContext} from '../context/AudioProvider'
import {play, pause, resume, playNext} from '../utility/audioController'

const AudioListScreen = () => {
  const [optionModalVisible, setOptionModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateCurrentAudioState,
    updatePlaybackObjState,
    updateSoundObjState,
  } = useContext(AudioContext)

  const rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          setCurrentItem(item)
          setOptionModalVisible(true)
        }}
        onAudioPress={() => handleAudioPress(item)}
      />
    )
  }

  const handleAudioPress = async (audio) => {
    if (soundObj === null) {
      const playbackObj = new Audio.Sound()
      const status = await play(playbackObj, audio.uri)

      updatePlaybackObjState(playbackObj)
      updateSoundObjState(status)
      return updateCurrentAudioState(audio)
    } else {
      if (
        soundObj.isLoaded &&
        soundObj.isPlaying &&
        currentAudio.id === audio.id
      ) {
        const status = await pause(playbackObj)
        return updateSoundObjState(status)
      }

      if (
        soundObj.isLoaded &&
        !soundObj.isPlaying &&
        currentAudio.id === audio.id
      ) {
        const status = await resume(playbackObj)
        return updateSoundObjState(status)
      }

      if (soundObj.isLoaded && currentAudio.id !== audio.id) {
        const status = await playNext(playbackObj, audio.uri)
        updateCurrentAudioState(audio)
        return updateSoundObjState(status)
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

  return (
    <AudioContext.Consumer>
      {({dataProvider}) => {
        return dataProvider._data.length !== 0 ? (
          <Screen>
            <RecyclerListView
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={rowRenderer}
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

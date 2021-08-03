import React, {useContext} from 'react'
import {StyleSheet, Text, View, Dimensions} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

import Screen from '../components/Screen'
import color from '../utility/color'
import PlayerButton from '../components/PlayerButton'
import {AudioContext} from '../context/AudioProvider'
import {pause, play, playNext, resume} from '../utility/audioController'
import {storeAudioForNextOpening} from '../utility/helper'

const width = Dimensions.get('window').width

const PlayerScreen = () => {
  const {
    audioFiles,
    playback,
    soundObj,
    totalAudioCount,
    currentAudioIndex,
    currentAudio,
    isPlaying,
    playbackPosition,
    playbackDuration,
    setPlayback,
    updateSoundObjState,
    updateIsPlayingState,
    updateCurrentAudioState,
    updateCurrentAudioIndexState,
    updatePlaybackPosition,
    updatePlaybackDuration,
  } = useContext(AudioContext)

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      const n = playbackPosition / playbackDuration
      return playbackPosition / playbackDuration
    }
    return 0
  }

  const handleNext = async () => {
    const {isLoaded} = await playback.getStatusAsync()
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount
    let audio = audioFiles[currentAudioIndex + 1]
    let index
    let status
    if (isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1
      status = await playNext(playback, audio.uri)
    } else if (!isLoaded && !isLastAudio) {
      index = currentAudioIndex + 1
      status = await play(playback, audio.uri)
    } else if (isLoaded && isLastAudio) {
      audio = audioFiles[0]
      index = 0
      status = await playNext(playback, audio.uri)
    } else if (!isLoaded && isLastAudio) {
      audio = audioFiles[0]
      index = 0
      status = await play(playback, audio.uri)
    }
    updateSoundObjState(status)
    updateIsPlayingState(true)
    updateCurrentAudioIndexState(index)
    updateCurrentAudioState(audio)
    updatePlaybackDuration(null)
    updatePlaybackPosition(null)
    setPlayback(playback)
    storeAudioForNextOpening(audio, index)
  }

  const handlePrevious = async () => {
    const {isLoaded} = await playback.getStatusAsync()
    const isFirstAudio = currentAudioIndex <= 0
    let audio = audioFiles[currentAudioIndex - 1]
    let index
    let status
    if (isLoaded && !isFirstAudio) {
      index = currentAudioIndex - 1
      status = await playNext(playback, audio.uri)
    } else if (!isLoaded && !isFirstAudio) {
      index = currentAudioIndex - 1
      status = await play(playback, audio.uri)
    } else if (isFirstAudio) {
      index = totalAudioCount - 1
      audio = audioFiles[index]
      if (isLoaded) {
        status = await playNext(playback, audio.uri)
      } else {
        status = await play(playback, audio.uri)
      }
    }
    updateSoundObjState(status)
    updateIsPlayingState(true)
    updateCurrentAudioIndexState(index)
    updateCurrentAudioState(audio)
    updatePlaybackDuration(null)
    updatePlaybackPosition(null)
    setPlayback(playback)
    storeAudioForNextOpening(audio, index)
  }

  const handlePlayPause = async () => {
    if (soundObj === null) {
      const audio = currentAudio
      const status = await play(playback, audio.uri)
      updateSoundObjState(status)
      updateCurrentAudioState(audio)
      updateIsPlayingState(true)
      playback.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

      return updateCurrentAudioIndexState(currentAudioIndex)
    }

    if (soundObj && soundObj.isPlaying) {
      const status = await pause(playback)
      updateSoundObjState(status)
      return updateIsPlayingState(false)
    }
    if (soundObj.isLoaded && !soundObj.isPlaying) {
      const status = await resume(playback)
      updateIsPlayingState(true)
      return updateSoundObjState(status)
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${
          currentAudioIndex + 1
        }/${totalAudioCount}`}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name='music-circle'
            size={300}
            color={isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {currentAudio.filename}
          </Text>
          <Slider
            style={{width: width, height: 40}}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioController}>
            <PlayerButton onPress={handlePrevious} iconType='previous' />
            <PlayerButton
              onPress={handlePlayPause}
              style={{marginHorizontal: 15}}
              iconType={isPlaying ? 'play' : 'pause'}
            />
            <PlayerButton onPress={handleNext} iconType='next' />
          </View>
        </View>
      </View>
    </Screen>
  )
}

export default PlayerScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: 'right',
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  audioController: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
})

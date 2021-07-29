import React, {useEffect, createContext, useState} from 'react'
import {View, Text, Alert} from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import {DataProvider} from 'recyclerlistview'

export const AudioContext = createContext()

const AudioProvider = ({children}) => {
  const [audioFiles, setAutoFiles] = useState([])
  const [permissionError, setPermissionError] = useState(false)
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1 !== r2)
  )
  const [playbackObj, setPlaybackObj] = useState(null)
  const [soundObj, setSoundObj] = useState(null)
  const [currentAudio, setCurrentAudio] = useState({})
  useEffect(() => {
    getPermissions()
  }, [])

  const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({mediaType: 'audio'})
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount,
    })
    setAutoFiles([...media.assets])
    setDataProvider(dataProvider.cloneWithRows([...media.assets]))
    //console.log(audioFiles)
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
    setPlaybackObj(newState)
  }
  const updateCurrentAudioState = (newState) => {
    setCurrentAudio(newState)
  }
  const updateSoundObjState = (newState) => {
    setSoundObj(newState)
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
        playbackObj,
        soundObj,
        currentAudio,
        updateCurrentAudioState,
        updatePlaybackObjState,
        updateSoundObjState,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export default AudioProvider

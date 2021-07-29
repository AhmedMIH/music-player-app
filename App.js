import React from 'react'
import AppNavigator from './src/navigations/AppNavigator'
import {NavigationContainer} from '@react-navigation/native'
import AudioProvider from './src/context/AudioProvider'
import {View} from 'react-native'
import AudioListItem from './src/components/AudioListItem'
const App = () => {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  )
}

export default App

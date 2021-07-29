export const play = async (playbackObj, uri) => {
  try {
    const status = await playbackObj.loadAsync({uri: uri}, {shouldPlay: true})
    return status
  } catch (error) {
    console.log('error inside play Helper method', error.message)
  }
}

export const pause = async (playbackObj) => {
  try {
    const status = await playbackObj.setStatusAsync({shouldPlay: false})
    return status
  } catch (error) {
    console.log('error inside pause Helper method', error.message)
  }
}

export const resume = async (playbackObj) => {
  try {
    const status = await playbackObj.playAsync()
    return status
  } catch (error) {
    console.log('error inside resume Helper method', error.message)
  }
}

export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync()
    await playbackObj.unloadAsync()
    return await play(playbackObj, uri)
  } catch (error) {
    console.log('error inside playNext Helper method', error.message)
  }
}

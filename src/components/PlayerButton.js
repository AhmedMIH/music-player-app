import React from 'react'
import {AntDesign} from '@expo/vector-icons'
import color from '../utility/color'

const PlayerButton = ({
  iconType,
  size = 40,
  Iconcolor = color.FONT,
  onPress,
  ...otherProps
}) => {
  const getIconName = () => {
    switch (iconType) {
      case 'play':
        return 'pausecircleo'
      case 'pause':
        return 'playcircleo'
      case 'next':
        return 'forward'
      case 'previous':
        return 'banckward'
    }
  }

  return (
    <AntDesign
      onPress={onPress}
      name={getIconName()}
      size={size}
      color={Iconcolor}
      {...otherProps}
    />
  )
}

export default PlayerButton

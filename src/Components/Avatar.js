import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Image } from 'react-native'

// Import local
import initial from '../utils/initial'
import style from '../style/defaultStyle'
import ViewPropTypes from '../config/viewPropTypes'

const Avatar = ({
  size,
  containerStyle,
  source,
  avatarStyle,
  textStyle,
  resizeMode,
  name,
  customSize,
}) => {
  const isImageExist = !!source && source !== ''
  let xSize
  let paddingVertical = 10
  let fontSize = style.FONT_SIZE
  let top = 0

  switch (size) {
    case 'small':
      xSize = 50
      fontSize = style.FONT_SIZE_SMALL
      paddingVertical = 10
      top = 5
      break
    case 'medium':
      xSize = 75
      fontSize = style.FONT_SIZE
      top = 15
      break
    case 'large':
      xSize = 100
      fontSize = style.FONT_SIZE_TITLE
      top = 25
      break
    default:
      xSize = customSize
      fontSize = customSize
      break
  }

  return (
    <View
      style={{
        width: xSize,
        height: xSize,
        marginHorizontal: 5,
        ...containerStyle,
      }}
    >
      {isImageExist && (
        <Image
          source={{ uri: source || '' }}
          style={[{ width: xSize, height: xSize, borderRadius: xSize / 2 }, avatarStyle]}
          resizeMode={resizeMode}
        />
      )}
      {!isImageExist && (
        <View style={[styles.avatarStyle, { paddingVertical }]}>
          <Text style={[styles.textStyle, { fontSize, top }, textStyle]}>{initial(name)}</Text>
        </View>
      )}
    </View>
  )
}

Avatar.propTypes = {
  source: PropTypes.string,
  size: PropTypes.string,
  name: PropTypes.string,
  customSize: PropTypes.number,
  resizeMode: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  avatarStyle: ViewPropTypes.style,
  textStyle: ViewPropTypes.style,
}

const styles = StyleSheet.create({
  avatarStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  textStyle: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export { Avatar }

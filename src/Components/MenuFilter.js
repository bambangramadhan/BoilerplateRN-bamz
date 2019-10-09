import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { View, Text, Platform, TouchableOpacity } from 'react-native';

import VIcon from './VIcon';
import color from '../style/color';
import navigation from '../navigation/';
import Style from '../style/defaultStyle';
import { height, width } from '../utils/dimension';
import ViewPropTypes from '../config/viewPropTypes';
import { fontPlatform } from '../utils/fontPlatform';

export const MenuFilter = React.forwardRef((props, ref) => {

  onPress = () => {
    props.isModalFilter ?
      props.onPress(props.options, props.styleModal) :
      props.onPress()
  }

  return (
    <View {...props} ref={ref} style={[props.style]}>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={_.debounce(onPress, 300, {
          leading: true,
          trailing: false
        })}>
        <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: Style.FONT_SIZE_MID, color: color.black }}>{props.selected}</Text>
        <VIcon
          type={'Feather'}
          name={'chevron-down'}
          size={20}
          color={'pink'}
        />
      </TouchableOpacity>
    </View>
  )
})

MenuFilter.propTypes = {
  // text: PropTypes.array,
  position: PropTypes.number,
  style: ViewPropTypes.style
}

export default MenuFilter;
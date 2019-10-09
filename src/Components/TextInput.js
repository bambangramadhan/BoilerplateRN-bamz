import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View, Text, TextInput, Platform } from 'react-native';

import VIcon from './VIcon';
import color from '../style/color';
import style from '../style/defaultStyle';
import { height } from '../utils/dimension';
import ViewPropTypes from '../config/viewPropTypes';
import { fontPlatform } from '../utils/fontPlatform';

export const TextInputDefault = React.forwardRef((props, ref) => {

  const [isFocused, setFocus] = useState(false);
  const [secureTextEntry, setSecure] = useState(props.secureTextEntry)

  handleFocus = () => setFocus(true);
  handleBlur = () => props.value.length === 0 ? setFocus(false) : setFocus(true)

  const labelStyle = {
    top: !isFocused && props.value.length === 0 ? height * 0.035 : height * 0,
    fontSize: !isFocused ? style.FONT_SIZE : style.FONT_SIZE,
    color: color.black,
    fontFamily: fontPlatform(Platform.OS, 'Regular')
  };

  const colorIcon = props.nameIcon == 'eye' || props.nameIcon == 'eye-with-line' || props.nameIcon == 'chevron-down' ? color.primaryPink : props.isValid ? color.primaryPink : color.gray;
  const showIcon = secureTextEntry === false && props.nameIcon === 'eye-with-line' ? 'eye' : props.nameIcon;
  const isIconExist = props.typeIcon && props.typeIcon !== '';

  showText = () => {
    if (secureTextEntry !== undefined) {
      setSecure(!secureTextEntry)
    } else {
      props.onPress
    }
  }

  return (
    <View style={[{
      alignSelf: 'center'
    }, props.styleWrapPage]}>
      <Text style={[labelStyle, props.styleText]}>
        {props.label}
      </Text>
      <View>
        <TextInput
          style={[{ width: style.TEXT_INPUT_WIDTH, height: style.TEXT_INPUT_HEIGHT, borderBottomWidth: isFocused ? 2 : 1, borderBottomColor: color.primaryPurple, fontFamily: fontPlatform(Platform.OS, 'Regular') }, props.style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={props.value}
          onChangeText={props.onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={props.keyboardType}
          onSubmitEditing={props.onSubmitEditing}
          isValid={props.isValid}
          ref={ref}
          editable={props.editable}
        />
        {isIconExist && (
          <VIcon
            type={props.typeIcon}
            name={showIcon}
            size={props.sizeIcon}
            color={colorIcon}
            style={props.styleIcon}
            containerStyle={[{ position: 'absolute', bottom: 20, right: 0 }, props.styleTouchable]}
            onPress={showText}
          />
        )}
      </View>
    </View>
  )
})

TextInputDefault.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChangeText: PropTypes.func,
  keyboardType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  typeIcon: PropTypes.string,
  nameIcon: PropTypes.string,
  sizeIcon: PropTypes.number,
  style: ViewPropTypes.style,
  styleIcon: ViewPropTypes.style,
  styleTouchable: ViewPropTypes.style,
  styleWrapPage: ViewPropTypes.style,
  // styleText: ViewPropTypes.style,
}

export default TextInputDefault;
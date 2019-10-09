import React from 'react';
import {View, Text, TouchableOpacity, Platform, Image} from 'react-native';
import { height , width } from '../utils/dimension';
import {fontPlatform} from '../utils/fontPlatform';
import style from '../style/defaultStyle';
import color from '../style/color';

export const Button = (props) => {
  
  const isImageExist = props.source && props.source !== ''

  return(
    <View>
      <TouchableOpacity 
        style={[{backgroundColor: color.white, borderColor: color.primaryPink, width: style.BUTTON_WIDTH, height: style.BUTTON_HEIGHT, borderRadius: 9, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}, props.style]}
        onPress={props.onPress}
      >
        <View style={{flexDirection: 'row'}}>
          {isImageExist && (
            <Image 
              style={[{width: width * 0.15, height: height * 0.035}, props.styleImage]}
              source={props.source}
            />
          )}   
          <Text style={[{textAlign: 'center', color: color.black, fontFamily: fontPlatform(Platform.OS, 'Medium')}, props.styleText]}>{props.text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Button;
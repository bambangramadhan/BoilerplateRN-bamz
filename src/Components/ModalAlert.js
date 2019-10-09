import React from 'react';
import {View, Text, Image, Platform} from 'react-native';
import { height, width } from '../utils/dimension'
import Button from './Button'
import {fontPlatform} from '../utils/fontPlatform';

export const ModalAlert = (props) => {  
    
    return(
      <View style={[{width: width * 0.7, height: height * 0.3, justifyContent:'center', alignItems:'center', backgroundColor: 'white', borderRadius: 20, shadowOffset: {width: 0, height: 8}, shadowOpacity: 1, shadowRadius: 14, shadowColor: '#C3B9CE'}, props.style]}>
        <View style ={[{justifyContent:'center', alignItems:'center', bottom: 10}]}>
          {props.icon == 'Warning' ? (
            <Image
              style={{width: width * 0.137, height: height * 0.084}}
              source={require('../assets/warning.png')}
            />) : (
              <Image
              style={{width: width * 0.15, height: height * 0.071}}
              source={require('../assets/success.png')}
            />
          )}
        </View>
        <View style={[{justifyContent: 'center'}, props.wrapTextStyle]}>
          <Text style={[{fontFamily: fontPlatform(Platform.OS, 'Bold'), color: '#4A207C', fontSize: 17, textAlign: 'center'}, props.titleStyle]}>
            {props.title}
          </Text> 
          <Text style={[{fontFamily: fontPlatform(Platform.OS, 'Medium'), color: '#53525B', fontSize: 13, textAlign: 'center'}, props.subtitleStyle]}>
            {props.subtitle}
          </Text>
        </View>
        <View style={[{ top : width * 0.03, flexDirection: 'row'}, props.wrapButtonStyle]}>
          <Button style={[{width: width * 0.2, height: height * 0.045, borderRadius: 19, borderWidth: 0}, props.buttonBackStyle]} text='B A T A L' onPress={props.onPressBack} />
          <Button style={[{width: width * 0.2, height: height * 0.045, borderRadius: 19, backgroundColor: '#56007D', borderWidth: 0}, props.buttonDoneStyle]} text='O K' onPress={props.onPressDone} />
        </View>
      </View>
    )
}

export default ModalAlert;
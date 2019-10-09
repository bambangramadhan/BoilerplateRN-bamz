import React from 'react';
import { View, Image, Text, Platform } from 'react-native';

import VIcon from './VIcon';
import Button from './Button';
import Color from '../style/color';
import Style from '../style/defaultStyle';
import { width, height } from '../utils/dimension';
import { fontPlatform } from '../utils/fontPlatform';
import rupiahConverter from '../utils/rupiahConverter';

export const LostConnection = (props) => {

  onPress = () => {

  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20, justifyContent: 'center', alignContent: 'center' }}>
      <Image
        style={{ resizeMode: 'contain', width: width * 0.35, height: height * 0.15, alignSelf: 'center', marginBottom: height * 0.06 }}
        source={require('../assets/phone-connection.png')}
      />
      <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Bold'), fontSize: Style.FONT_SIZE_MID_LARGE, color: '#3B3B4D', textAlign: 'center', marginBottom: height * 0.02 }}>{'Hmm.. Sepertinya \n internet kamu terputus.'}</Text>
      <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: Style.FONT_SIZE_MID, color: '#6C7B8A', textAlign: 'center', marginBottom: height * 0.03 }}>{'Perangkat kamu tidak terhubung ke internet \n pastikan koneksi kamu berfungsi.'}</Text>
      <Button
        text={'COBA LAGI'}
        style={{ width: width * 0.5, height: height * 0.07, backgroundColor: Color.primaryPink, alignSelf: 'center', borderWidth: 0, elevation: 3, marginTop: height * 0.05, marginBottom: height * 0.05 }}
        styleText={{ color: Color.white, letterSpacing: 2 }}
        onPress={this.onPress}
      />
    </View>
  )
}

export default LostConnection;
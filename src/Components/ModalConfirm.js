import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { View, Text, Image, Platform, KeyboardAvoidingView } from 'react-native';

import VIcon from './VIcon';
import color from '../style/color';
import style from '../style/defaultStyle';
import navigation from '../navigation/';
import TextInput from '../components/TextInput';
import { height, width } from '../utils/dimension';
import ViewPropTypes from '../config/viewPropTypes';
import { fontPlatform } from '../utils/fontPlatform';

export default class ModalConfirm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.typeConfirm,
      password: ''
    }
  }

  _dismissOverlay = () => {
    Navigation.dismissOverlay(this.props.componentId);
  };

  changeType = () => {
    this.setState({
      type: 'inputPassword'
    })
  }

  onChangeText = (value) => {
    this.setState({
      password: value
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
        <View style={{ flex: 1, backgroundColor: color.purpleOverlay }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={
              {
                backgroundColor: color.white,
                width: style.MODAL_ALERT_WIDTH,
                height: this.state.type === 'inputPassword' ? height * 0.35 : style.MODAL_ALERT_HEIGHT,
                borderRadius: 9
              }}>
              <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: width * 0.03 }]}>
                {this.props.icon == 'Warning' ? (
                  <Image
                    style={{ width: width * 0.137, height: height * 0.084 }}
                    source={require('../assets/warning.png')}
                    resizeMode={'contain'}
                  />) : (
                    <Image
                      style={{ width: width * 0.15, height: height * 0.071 }}
                      source={require('../assets/success.png')}
                      resizeMode={'contain'}
                    />
                  )}
              </View>
              {this.state.type === 'inputPassword' ?
                <View style={[{ justifyContent: 'center', marginTop: width * 0.02 }, this.props.wrapTextStyle]}>
                  <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Bold'), color: color.primaryPurple, fontSize: style.FONT_SIZE, textAlign: 'center' }, this.props.titleStyle]}>
                    {'Masukkan Password'}
                  </Text>
                  <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Regular'), color: color.subtitle, fontSize: style.FONT_SIZE_SMALL, textAlign: 'center' }, this.props.subtitleStyle]}>
                    {'Masukkan password untuk \n konfirmasi pembelian'}
                  </Text>
                  <View style={{ marginTop: width * 0.02 }}>
                    <TextInput
                      style={{ width: width * 0.5 }}
                      label={'Password'}
                      value={this.state.password}
                      onChangeText={this.onChangeText}
                      secureTextEntry={true}
                      typeIcon={'Entypo'}
                      nameIcon={'eye-with-line'}
                      sizeIcon={20}
                    />
                    {this.props.confirmationFailed &&
                      <Text style={{ color: color.primaryPink, fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: style.FONT_SIZE_SMALLER, paddingLeft: width * 0.15 }}>{'Password yang kamu masukkan salah !'}</Text>
                    }
                  </View>
                </View>
                :
                <View style={[{ justifyContent: 'center', marginTop: width * 0.02 }, this.props.wrapTextStyle]}>
                  <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Bold'), color: color.primaryPurple, fontSize: style.FONT_SIZE, textAlign: 'center' }, this.props.titleStyle]}>
                    {this.props.title}
                  </Text>
                  <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Regular'), color: color.subtitle, fontSize: style.FONT_SIZE_SMALL, textAlign: 'center' }, this.props.subtitleStyle]}>
                    {this.props.subtitle}
                  </Text>
                </View>
              }
              <View
                style={[{
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: this.props.confirmationFailed ? (Platform.OS == 'android' ? height * 0.028 : height * 0.012) : this.state.type == 'inputPassword' ? (Platform.OS == 'android' ? height * 0.043 : height * 0.031) : this.props.type == 'updatePassword' ? (Platform.OS == 'android' ? height * 0.015 : height * 0.01) : this.props.type == 'logOut' ? (Platform.OS == 'android' ? height * 0.06 : height * 0.01) : (Platform.OS == 'android' ? height * 0.045 : height * 0.033)
                },
                this.props.wrapButtonStyle]}>
                <VIcon
                  type={'Feather'}
                  name={'x'}
                  size={20}
                  color={color.white}
                  style={this.props.styleIcon}
                  containerStyle={[{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: color.primaryPink, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.02, activeOpacity: 0 }, this.props.styleTouchable]}
                  onPress={this._dismissOverlay}
                />

                <VIcon
                  type={'Feather'}
                  name={'check'}
                  size={20}
                  color={color.white}
                  style={this.props.styleIcon}
                  containerStyle={[{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: color.primaryPurple, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.02, activeOpacity: 0 }, this.props.styleTouchable]}
                  onPress={this.state.type == 'confirmPassword' ? this.changeType : this.props.type == 'updatePassword' ? this.props.onPress : () => this.props.onPress(this.state.password)}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

ModalConfirm.propTypes = {
  value: PropTypes.any,
  onChangeText: PropTypes.func,
  icon: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  componentId: PropTypes.string,
  style: ViewPropTypes.style,
  wrapTextStyle: ViewPropTypes.style,
  titleStyle: ViewPropTypes.style,
  subtitleStyle: ViewPropTypes.style,
  styleIcon: ViewPropTypes.style
}
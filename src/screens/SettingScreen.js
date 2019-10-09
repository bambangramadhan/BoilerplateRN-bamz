import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, Text, Platform } from 'react-native';

import Color from '../../style/color';
import { setToken } from '../akun/action';
import navigation from '../../navigation/';
import Style from '../../style/defaultStyle';
import { loginStatus } from '../login/action';
import TextAkun from '../../components/TextAkun';
import HeaderFood from '../../components/HeaderFood';
import { height, width } from '../../utils/dimension';
import { fontPlatform } from '../../utils/fontPlatform';

export class SettingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  topUp = () => {

  }

  ModalConfirmLogout = () => {
    let data = {
      icon: 'Warning',
      title: 'Keluar !',
      type: 'updatePassword',
      subtitle: 'Yakin mau keluar ?',
      onPress: () => this.gotoLogut()
    }
    Navigation.showOverlay(navigation.ModalConfirm(data));
  }

  gotoLogut = () => {
    this.props.setToken(null)
    this.props.loginStatus(0);
    Navigation.setRoot(navigation.login())
    Navigation.dismissOverlay("ModalConfirm");
  }

  backToAkun = () => {
    Navigation.pop(this.props.componentId)
  }

  gotoEditPassword = () => {
    Navigation.push(this.props.componentId, navigation.views.editPassword());
  }

  gotoEditAkun = () => {
    Navigation.push(this.props.componentId, navigation.views.editAkun());
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 20 }}>
        <HeaderFood
          text={'Pengaturan'}
          onPress={this.backToAkun}
        />
        <View style={{ width: width * 0.8, height: height, alignSelf: 'center' }}>
          <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: Style.FONT_SIZE_MID, marginBottom: height * 0.005, marginTop: height * 0.02 }}>Info</Text>

          <TextAkun
            typeIcon={'Feather'}
            nameIcon={'chevron-right'}
            title={'AKUN'}
            subtitle={'Data diri, Alamat, dll'}
            onPress={this.gotoEditAkun}
            containerStyle={{ height: height * 0.06, marginTop: height * 0.01 }}
          />

          <View style={{ borderWidth: 0.4, marginTop: height * 0.015, marginBottom: height * 0.015, borderColor: Color.grayText }} />

          <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: Style.FONT_SIZE_MID, marginBottom: height * 0.005, marginTop: height * 0.01 }}>Keamanan</Text>

          <TextAkun
            typeIcon={'Feather'}
            nameIcon={'chevron-right'}
            title={'KEAMANAN'}
            subtitle={'Ganti Kata Sandi'}
            onPress={this.gotoEditPassword}
            containerStyle={{ height: height * 0.06, marginTop: height * 0.01 }}
          />

          <View style={{ borderWidth: 0.4, marginTop: height * 0.015, marginBottom: height * 0.015, borderColor: Color.grayText }} />

          <TextAkun
            typeIcon={'Ionicons'}
            nameIcon={'ios-log-out'}
            title={'KELUAR'}
            subtitle={'Keluar dari Aplikasi'}
            onPress={this.ModalConfirmLogout}
            containerStyle={{ height: height * 0.06, marginTop: height * 0.01 }}
          />

        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  loginStatus: (data) => dispatch(loginStatus(data)),
  setToken: (data) => dispatch(setToken(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingScreen)
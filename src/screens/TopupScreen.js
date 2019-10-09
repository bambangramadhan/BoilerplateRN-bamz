import React from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView, Text, Platform } from 'react-native';

import Color from '../../style/color';
import { topupRequest } from './action';
import navigation from '../../navigation/';
import Style from '../../style/defaultStyle';
import HeaderFood from '../../components/HeaderFood';
import { height, width } from '../../utils/dimension';
import { fontPlatform } from '../../utils/fontPlatform';
import ListBankTopup from '../../components/ListBankTopup';

export class TopupScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  gotoDetailBank = (type, image) => {
    Navigation.push(this.props.componentId, navigation.views.detailBank({ type, image }));
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
        >
          <HeaderFood
            text={'Topup KotakUang'}
            onPress={this.goBack}
          />
          <View style={{ width: width * 0.8, height: '100%', alignSelf: 'center', marginBottom: height * 0.04 }}>
            <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: Style.FONT_SIZE_MID, color: Color.grayNumber }}>Via Bank</Text>
            <View style={{ borderWidth: 0.4, borderColor: Color.grayText, width: width * 0.8, marginVertical: height * 0.02 }} />
            <ListBankTopup
              text={'Bank Mandiri'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Bank Mandiri', require('../../assets/ic_bank_mandiri.png'))}
              image={require('../../assets/ic_bank_mandiri.png')}
            />
            <ListBankTopup
              text={'Bank Permata'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Bank Permata', require('../../assets/ic_bank_permata.png'))}
              image={require('../../assets/ic_bank_permata.png')}
            />
            <ListBankTopup
              text={'Bank Danamon'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Bank Danamon', require('../../assets/ic_bank_danamon.png'))}
              image={require('../../assets/ic_bank_danamon.png')}
            />
            <ListBankTopup
              text={'CIMB Niaga'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('CIMB Niaga', require('../../assets/ic_cimb_niaga.png'))}
              image={require('../../assets/ic_cimb_niaga.png')}
            />
            <ListBankTopup
              text={'BCA'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('BCA', require('../../assets/ic_bca.png'))}
              image={require('../../assets/ic_bca.png')}
            />
            <ListBankTopup
              text={'BRI'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('BRI', require('../../assets/ic_bri.png'))}
              image={require('../../assets/ic_bri.png')}
            />
            <ListBankTopup
              text={'BNI'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('BNI', require('../../assets/ic_bni.png'))}
              image={require('../../assets/ic_bni.png')}
            />
            <ListBankTopup
              text={'Bank Panin'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Bank Panin', require('../../assets/ic_bank_panin.png'))}
              image={require('../../assets/ic_bank_panin.png')}
            />
            <ListBankTopup
              text={'Maybank'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Maybank', require('../../assets/ic_maybank.png'))}
              image={require('../../assets/ic_maybank.png')}
            />
            <ListBankTopup
              text={'BTN'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('BTN', require('../../assets/ic_btn.png'))}
              image={require('../../assets/ic_btn.png')}
            />
            <ListBankTopup
              text={'Bank Lainnya'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Bank Lainnya')}
              hideImage={true}
            />

            <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: Style.FONT_SIZE_MID, color: Color.grayNumber, marginTop: height * 0.02 }}>Via Gerai</Text>
            <View style={{ borderWidth: 0.4, borderColor: Color.grayText, width: width * 0.8, marginVertical: height * 0.02 }} />
            <ListBankTopup
              text={'Alfamart'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Minimarket', require('../../assets/ic_alfamart.png'))}
              image={require('../../assets/ic_alfamart.png')}
            />
            <ListBankTopup
              text={'Alfamidi'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Minimarket', require('../../assets/ic_alfamidi.png'))}
              image={require('../../assets/ic_alfamidi.png')}
            />
            <ListBankTopup
              text={'AlfaExpress'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Minimarket', require('../../assets/ic_alfa_express.png'))}
              image={require('../../assets/ic_alfa_express.png')}
            />
            <ListBankTopup
              text={'Lawson'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Minimarket', require('../../assets/ic_lawson.png'))}
              image={require('../../assets/ic_lawson.png')}
            />
            <ListBankTopup
              text={'Dan+Dan'}
              typeIcon={'Feather'}
              nameIcon={'chevron-right'}
              onPress={() => this.gotoDetailBank('Minimarket', require('../../assets/ic_dandan.png'))}
              image={require('../../assets/ic_dandan.png')}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  akunRedux: state.akun,
  topupRedux: state.topup
})

const mapDispatchToProps = dispatch => ({
  topupRequest: (data) => dispatch(topupRequest(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopupScreen)
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View, Text, Platform, TouchableOpacity } from 'react-native';

import color from '../style/color';
import Style from '../style/defaultStyle';
import ButtonCounter from './ButtonCounter';
import { height, width } from '../utils/dimension';
import ViewPropTypes from '../config/viewPropTypes';
import { fontPlatform } from '../utils/fontPlatform';
import rupiahConverter from '../utils/rupiahConverter';

export default class FooterCart extends React.PureComponent {

  render() {
    return (
      <View style={[{ width: width * 0.9, height: height * 0.1, backgroundColor: color.primaryPurple, justifyContent: 'center', alignItems: 'center', borderRadius: 9, alignSelf: 'center' }, this.props.style]}>
        <View style={[{ flexDirection: 'row', width: width * 0.9, height: '100%' }, this.props.styleWrap]}>
          <View style={{ width: width * 0.5, height: '100%', justifyContent: 'center' }}>
            <View style={{ display: "flex", flexDirection: 'row' }}>
              <ButtonCounter
                isShow={true}
                number={this.props.number}
                type={'cart'}
                style={[{ marginHorizontal: 6, marginLeft: width * 0.03 }, this.props.styleButtonCounter]}
              />
              <View style={{ flexDirection: this.props.isInfoBalance ? 'column' : null }}>
                <Text style={[{ alignSelf: this.props.isInfoBalance ? null : 'center', color: color.white, fontFamily: fontPlatform(Platform.OS, 'Medium'), marginHorizontal: 6 }, this.props.styleRupiah]}>RP. {rupiahConverter(this.props.price)},-</Text>
                <Text style={[{ alignSelf: 'center', color: color.white, fontFamily: fontPlatform(Platform.OS, 'Medium'), marginHorizontal: 6, fontSize: Style.FONT_SIZE_SMALLER }, this.props.infoBalanceStyle]}>{this.props.infoBalance}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{ width: width * 0.4, height: '100%', justifyContent: 'center' }}
            onPress={_.debounce(this.props.onPress, 300, {
              leading: true,
              trailing: false
            })}
          >
            <Text style={[{ color: color.white, fontFamily: fontPlatform(Platform.OS, 'Medium'), alignSelf: 'flex-end', marginRight: width * 0.03, letterSpacing: 3.5 }, this.props.styleText]}>{this.props.text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

FooterCart.propTypes = {
  text: PropTypes.string,
  price: PropTypes.number,
  number: PropTypes.number,
  style: ViewPropTypes.style,
  styleText: ViewPropTypes.style,
  styleWrap: ViewPropTypes.style,
  styleRupiah: ViewPropTypes.style,
  styleButtonCounter: ViewPropTypes.style
}
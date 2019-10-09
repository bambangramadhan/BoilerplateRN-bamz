import React from 'react';
import { View, Image, TouchableOpacity, Platform, Text } from 'react-native';
import { fontPlatform } from '../utils/fontPlatform';
import color from '../style/color';
import style from '../style/defaultStyle'

export const CardFood = (props) => {

    const isImageExist = props.source && props.source !== ''

    return (
        <View>
            <TouchableOpacity onPress={props.onPress}>
                {
                    isImageExist ?
                        <Image
                            style={[{ width: style.CARD_FOOD_WIDTH, height: style.CARD_FOOD_HEIGHT, borderRadius: 19 }, props.style]}
                            source={props.source}
                        /> :
                        <View style={[{ width: style.CARD_FOOD_WIDTH, height: style.CARD_FOOD_HEIGHT, borderRadius: 19, backgroundColor: color.white, justifyContent: 'center', alignItems: 'center' }, props.style]}>
                            <Text style={[{ textAlign: 'center', color: color.black, fontFamily: fontPlatform(Platform.OS, 'Medium') }, props.textStyle]}>No Image</Text>
                        </View>
                }
            </TouchableOpacity>
        </View>
    )
}

export default CardFood;


<View style={{ flex: 1, backgroundColor: color.purpleOverlay }}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
            backgroundColor: color.white,
            width: style.MODAL_QR_WIDTH,
            height: style.MODAL_QR_HEIGHT,
            borderRadius: 9,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: width * 0.03 }]}>
                <QRCode
                    value={'ABC DEF GHI'}
                    size={240}
                    color={color.primaryPurple}
                />
            </View>
            <View style={[{ justifyContent: 'center', marginTop: width * 0.02 }, this.props.wrapTextStyle]}>
                <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Medium'), color: color.subtitle, fontSize: style.FONT_SIZE_MID, textAlign: 'center', top: width * 0.05 }, this.props.subtitleStyle]}>
                    Tunjukan barcode untuk melakukan transaksi
							</Text>
            </View>
        </View>
    </View>
    <View style={[{ alignSelf: 'center', position: 'absolute', bottom: height * 0.195, justifyContent: 'space-between' }, this.props.wrapIconStyle]}>
        <VIcon
            type={'Feather'}
            name={'check'}
            size={20}
            color={color.white}
            style={this.props.styleIcon}
            containerStyle={[{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: color.primaryPurple, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.02, activeOpacity: 0 }, this.props.styleTouchable]}
            onPress={this._dismissOverlay}
        />
    </View>
</View>


import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import color from '../style/color';
import style from '../style/defaultStyle';
import { height, width } from '../utils/dimension';
import { fontPlatform } from '../utils/fontPlatform';
import VIcon from './VIcon';
import QRCode from 'react-native-qrcode-svg';

export default class ModalQR extends React.PureComponent {
    _dismissOverlay = () => {
        Navigation.dismissOverlay(this.props.componentId);
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: color.purpleOverlay }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: color.white,
                        width: style.MODAL_QR_WIDTH,
                        height: style.MODAL_QR_HEIGHT,
                        borderRadius: 9,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: width * 0.03 }]}>
                            <QRCode
                                value={'ABC DEF GHI'}
                                size={240}
                                color={color.primaryPurple}
                            />
                        </View>
                        <View style={[{ justifyContent: 'center', marginTop: width * 0.02 }, this.props.wrapTextStyle]}>
                            <Text style={[{ fontFamily: fontPlatform(Platform.OS, 'Medium'), color: color.subtitle, fontSize: style.FONT_SIZE_MID, textAlign: 'center', top: width * 0.05 }, this.props.subtitleStyle]}>
                                Tunjukan barcode untuk melakukan transaksi
							</Text>
                        </View>
                    </View>
                </View>
                <View style={[{ alignSelf: 'center', position: 'absolute', bottom: height * 0.195, justifyContent: 'space-between' }, this.props.wrapIconStyle]}>
                    <VIcon
                        type={'Feather'}
                        name={'check'}
                        size={20}
                        color={color.white}
                        style={this.props.styleIcon}
                        containerStyle={[{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: color.primaryPurple, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.02, activeOpacity: 0 }, this.props.styleTouchable]}
                        onPress={this._dismissOverlay}
                    />
                </View>
            </View>
        )
    }
}
import React from 'react';
import {View, Image, Text} from 'react-native'; 
import {width} from '../utils/dimension'
import color from '../style/color';

export const ButtonCounter = (props) => {

    return(
        <View style={[{justifyContent: 'center', alignItems: 'center', width: width * 0.06, height: width * 0.06}, props.style]}>
            {props.isEdit && 
                <Image 
                    style={[{width: width * 0.06, height: width * 0.06, resizeMode: 'contain'}, props.styleIcon]}
                    source={props.type == 'cart' ? require('../assets/square-white.png') : require('../assets/square-purple.png')}
                />
            }
            <View style={{width: width * 0.06, height: width * 0.06, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0}}>
                <Text style={[{textAlign: 'center', color: props.type == 'cart' ? color.white : color.black}, props.styleText]}>{props.number}</Text>
            </View>
        </View>
    )
}

export default ButtonCounter;
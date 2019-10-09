import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import {fontPlatform} from '../utils/fontPlatform';
import color from '../style/color';
import style from '../style/defaultStyle';
import {width} from '../utils/dimension'

export const CardDate = (props) => {

    let card;
    
    switch (props.type) {
        default:
            card = 
            (
            <TouchableOpacity onPress={props.onPress}>
                <View style={[{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, borderWidth: 3, backgroundColor: color.primaryPink, borderColor: color.primaryPurple, justifyContent: 'center', alignItems: 'center'}, props.style]}>
                    <Text style={[{textAlign: 'center', color: color.white, fontSize: 12}, props.styleCurrent]}>{props.current}</Text>
                    <Text style={[{textAlign: 'center', color: color.white, fontFamily: fontPlatform(Platform.OS, 'Bold'), fontSize: 19}, props.styleDate]}>{props.date}</Text>
                    <Text style={[{textAlign: 'center', color: color.white, fontFamily: fontPlatform(Platform.OS, 'Bold'), fontSize: 15}, props.styleDay]}>{props.day}</Text>
                </View>
            </TouchableOpacity>
            );
            break;
        case 'home':
            card = 
            (
            <TouchableOpacity onPress={props.onPress}>
                <View style={ props.isActive ? [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, borderWidth: 3, backgroundColor: color.primaryPink, borderColor: color.primaryPurple, justifyContent: 'center', alignItems: 'center'}, props.style] : [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, borderWidth: 3, backgroundColor: color.white, borderColor: color.gray}, props.style]}>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontSize: 11}, props.styleCurrent]}>{props.isActive ? props.current : ''}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Bold') : fontPlatform(Platform.OS, 'Medium'), fontSize: 19}, props.styleDate]}>{props.date}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontFamily: fontPlatform(Platform.OS, 'Bold'), fontSize: 15}, props.styleDay]}>{props.day}</Text>
                </View>
            </TouchableOpacity>
            );
            break;
        case 'order':
            card = 
            (
            <TouchableOpacity onPress={props.onPress}>
                <View style={ props.isActive ? [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, justifyContent: 'center', alignItems: 'center'}, props.style] : [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, borderWidth: 3, backgroundColor: color.white, borderColor: color.gray}, props.style]}>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.black : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Bold') : fontPlatform(Platform.OS, 'Medium'), fontSize: 13}, props.styleCurrent]}>{props.isActive ? props.current : ''}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.black : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Bold') : fontPlatform(Platform.OS, 'Medium'), fontSize: 19}, props.styleDate]}>{props.date}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.black : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Bold') : fontPlatform(Platform.OS, 'Medium'), fontSize: 13}, props.styleDay]}>{props.day}</Text>
                </View>
            </TouchableOpacity>
            );
            break;
    }

    return(
        
            <TouchableOpacity onPress={props.onPress}>
                <View style={ props.isActive ? [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primaryPink}, props.style] : [{width: style.CARD_DATE_WIDTH, height: style.CARD_DATE_HEIGHT, borderRadius: 9, borderWidth: 3, backgroundColor: color.white, borderColor: color.gray, justifyContent: 'center', alignItems: 'center', paddingBottom: width * 0.04}, props.style]}>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Medium') : fontPlatform(Platform.OS, 'Medium'), fontSize: 13}, props.styleCurrent]}>{props.isActive ? props.current : ''}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Bold') : fontPlatform(Platform.OS, 'Medium'), fontSize: 22}, props.styleDate]}>{props.date}</Text>
                    <Text style={[{textAlign: 'center', color: props.isActive ? color.white : color.gray, fontFamily: props.isActive ? fontPlatform(Platform.OS, 'Medium') : fontPlatform(Platform.OS, 'Medium'), fontSize: 13}, props.styleDay]}>{props.day}</Text>
                </View>
            </TouchableOpacity>
        
    )
}

export default CardDate;
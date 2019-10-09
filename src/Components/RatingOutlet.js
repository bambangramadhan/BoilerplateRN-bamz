import React from 'react';
import {Text, View, Platform} from 'react-native';
import VIcon from './VIcon';
import color from '../style/color';
import {fontPlatform} from '../utils/fontPlatform';
import style from '../style/defaultStyle';
import {height, width} from '../utils/dimension'


export const RatingOutlet = (props) => {

    let stars = [];
    let mod = props.rating;
    for (var i = 1; i <= 5; i++) {
        let nameIcon;
        if (mod == 0.5){
            mod--;
            nameIcon = 'star-half-empty';
        }  else if(mod < 0.5) {
            nameIcon = 'star-o';
        } else if (mod > 0) {
            mod--;
            nameIcon = 'star';
        }
        stars.push((<VIcon key={i} type={'FontAwesome'} name={nameIcon} size={10} color={color.yellowStar} style={{marginHorizontal: 2}} />));
    }

    return(
        <View style={{ width: width, height: height * 0.15, flexDirection: 'row'}}>
            <View style={{ width: width * 0.8, paddingLeft: width * 0.05}}>
                <Text style={{fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_MID, color: color.black}}>
                    {props.outlet}
                </Text>

                <View style={{flexDirection: 'row', right: width * 0.004}}>
                    {props.categories.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_SMALLER, color: color.gray, flexDirection: 'row', marginHorizontal: 2}}>
                                {item}                    
                            </Text>
                            {index < props.categories.length - 1 && 
                                <VIcon  
                                    type={'FontAwesome'}
                                    name={'circle'}
                                    size={4}
                                    color={color.gray}
                                    style={{alignSelf: 'center', marginHorizontal: 2}}
                                />
                            }
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ width: width * 0.8, paddingRight: width * 0.05, top: width * 0.055, flexDirection: 'row', right: width * 0.1}}> 
                {stars}
                <Text style={{fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_SMALLER, color: color.gray, bottom: width * 0.005}}> {props.rating}</Text>
                <Text style={{fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_SMALLER, color: color.gray, bottom: width * 0.005}}> {props.allUser}</Text>
            </View>
        </View>
    )
}

export default RatingOutlet;